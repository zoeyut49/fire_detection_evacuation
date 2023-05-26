import logging
import time
import json

import boto3
import os

def lambda_handler(event, context):
    
    client = boto3.client('iot-data', region_name='us-east-1')

    mode = 'publish'
    topic = 'lab/digital_twin/fire'
    port = 8883

    # Publish 

    if mode == 'publish':
        messageJson = json.dumps(event)
        client.publish(
            topic= topic,
            qos=1,
            payload=json.dumps(messageJson)
        )
        print('Published topic %s: %s\n' % (topic, messageJson))
    time.sleep(1)