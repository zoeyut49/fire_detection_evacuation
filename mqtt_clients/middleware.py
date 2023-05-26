'''
/*
 * Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 '''

from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import logging
import time
import argparse
import json
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
import requests
import datetime
import os
import threading

# import sonos.test_soco as sonos
# import Spot.replay_mission.replay_mission as spot

#opening an s3 session connected to the element212-sonos bucket (bucket used for Sonos data dump)
data_session = boto3.Session(aws_access_key_id= "", aws_secret_access_key= "")
S3 = data_session.resource('s3')
object = S3.Object('mqtt-status', 'status.json')

def log(error, function, device):
    #datetime object containing current date and time
    n = datetime.datetime.now()

    #dd/mm/YY H:M:S
    #dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    dt_string = n.strftime("%m/%d/%Y %H:%M:%S")
    print("date and time =", dt_string)

    #putting the song names, current date/time and file name into the s3 bcuket in json file format
    output={"Date+Time": dt_string, 'Device': device, 'Function Name': function, 'Status': error}
    out=json.dumps(output)
    object.put(Body=out)

AllowedActions = ['both', 'subscribe']

# Read in command-line parameters
parser = argparse.ArgumentParser()
parser.add_argument("-e", "--endpoint", action="store", required=True, dest="host", help="Your AWS IoT custom endpoint")
parser.add_argument("-r", "--rootCA", action="store", required=True, dest="rootCAPath", help="Root CA file path")
parser.add_argument("-c", "--cert", action="store", dest="certificatePath", help="Certificate file path")
parser.add_argument("-k", "--key", action="store", dest="privateKeyPath", help="Private key file path")
parser.add_argument("-p", "--port", action="store", dest="port", type=int, help="Port number override")
parser.add_argument("-w", "--websocket", action="store_true", dest="useWebsocket", default=False,
                    help="Use MQTT over WebSocket")
parser.add_argument("-id", "--clientId", action="store", dest="clientId", default="basicPubSub",
                    help="Targeted client id")
parser.add_argument("-t", "--topic", action="store", dest="topic", default="lab/digital_twin/fire", help="Targeted topic")
parser.add_argument("-m", "--mode", action="store", dest="mode", default="both",
                    help="Operation modes: %s"%str(AllowedActions))
parser.add_argument("-M", "--message", action="store", dest="message", default="Hello World!",
                    help="Message to publish")

# set args to appropriate variables
args = parser.parse_args()
host = args.host
rootCAPath = args.rootCAPath
certificatePath = args.certificatePath
privateKeyPath = args.privateKeyPath
port = args.port
useWebsocket = args.useWebsocket
clientId = args.clientId
topic = args.topic

if args.mode not in AllowedActions:
    parser.error("Unknown --mode option %s. Must be one of %s" % (args.mode, str(AllowedActions)))
    exit(2)

if args.useWebsocket and args.certificatePath and args.privateKeyPath:
    parser.error("X.509 cert authentication and WebSocket are mutual exclusive. Please pick one.")
    exit(2)

if not args.useWebsocket and (not args.certificatePath or not args.privateKeyPath):
    parser.error("Missing credentials for authentication.")
    exit(2)

# Port defaults
if args.useWebsocket and not args.port:  # When no port override for WebSocket, default to 443
    port = 443
if not args.useWebsocket and not args.port:  # When no port override for non-WebSocket, default to 8883
    port = 8883

# Configure logging
logger = logging.getLogger("AWSIoTPythonSDK.core")
logger.setLevel(logging.DEBUG)
streamHandler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
streamHandler.setFormatter(formatter)
logger.addHandler(streamHandler)

# Init AWSIoTMQTTClient
myAWSIoTMQTTClient = None
if useWebsocket:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId, useWebsocket=True)
    myAWSIoTMQTTClient.configureEndpoint(host, port)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath)
else:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
    myAWSIoTMQTTClient.configureEndpoint(host, port)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

# AWSIoTMQTTClient connection configuration
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

# sonos function that lives separately in order to run async. also parses sonos args
def sonos_parser(payload_args):
    #parse sonos args
    if payload_args['sonos'] == True:
        print("sonos activated!")
        if payload_args['drill'] == True:
            print("executing drill function...")
            sonos.drill()
            try:
                sonos.drill()
            except Exception as error:
                #res 500 status
                print(error)
                log(error, 'drill', 'sonos')
            else:
                #res 200 status
                print("success")
                log('sucess', 'drill', 'sonos')
        elif payload_args['drill'] == False:
            sonos.not_drill()
            print("executing not drill function...")
            try:
                sonos.drill()
            except Exception as error:
                #res 500 status
                print(error)
                log(error, 'not drill', 'sonos')
            else:
                #res 200 status
                print("success")
                log('success', 'not drill', 'sonos')
    else:
        print("sonos is sleeping")
        try:
            sonos.stopPlaying()
        except Exception as error:
            #res 500 status
            print(error)
            log(error, 'stop', 'sonos')
        else:
            #res 200 status
            print("success")
            log('success', 'not drill', 'sonos')

# Custom MQTT message callback. This catches the message/acts when a message is recieved
def customCallback(client, userdata, message):
    # parse the JSON arguments
    print("---------testing---------")
    payloadString = message.payload.decode("utf-8")
    payloadString = payloadString[1:len(payloadString)-1].replace("\\", "")
    payload_args = json.loads(payloadString)
    if payload_args['payload']:
        payload_args = payload_args['payload']
    
    print(payload_args)

    # start a thread for sonos and have it run separately
    #thr = threading.Thread(target=sonos_parser, args=(payload_args,), kwargs={})
    #thr.start()
   
    # parse spot arg and activate
    if payload_args['spot'] == True:
        try:
            print("spot activated!")
            os.environ['BOSDYN_CLIENT_USERNAME']='user'
            os.environ['BOSDYN_CLIENT_PASSWORD']='4mk42jmqpp66'
            os.system('python3 -m replay_mission 192.168.42.38 autowalk /Users/macmini3/Documents/nyc-intern-2022-lab/mqtt_clients/Spot/replay_mission/human-detection')
        except Exception as error:
            print(error)
            log(error, 'autowalk', 'spot')
        else:
            log('success', 'autowalk', 'spot')
    else:
        print("spot is sleeping")
        
    #thr.join()
    print("test success")
    
# Connect and subscribe to AWS IoT
myAWSIoTMQTTClient.connect()
if args.mode == 'both' or args.mode == 'subscribe':
    myAWSIoTMQTTClient.subscribe(topic, 1, customCallback)
time.sleep(2)


while True:
    time.sleep(30)