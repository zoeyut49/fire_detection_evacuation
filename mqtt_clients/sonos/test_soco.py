from os import access
import threading
from urllib import response
import soco
import time
import requests
import random
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
import requests
import datetime
import json

#Accessing the S3 buckets using boto3 client

#session for pulling from sonos-bucket (bucket of songs)
session = boto3.Session(region_name= 'us-east-1')
s3 = session.resource('s3')
bucket = s3.Bucket('sonos-bucket')

#session for dumping data for logs
data_session = boto3.Session(aws_access_key_id= "", aws_secret_access_key= "")
S3 = data_session.resource('s3')
object = S3.Object('element212-sonos', 'sonos-data.json') #file for data log
object2 = S3.Object('element212-sonos', 'Tiberius-data.json') #file specifically for tiberius data during not_drill

#=====================================================================================

#function for finding the Neo group on the network and playing the alarm on it during the not_drill() function
def play_neo(speakers, alarm, song):
    for x in speakers:
        if x.player_name == 'Neo Sonos':
            print('calling neo in play_neo')
            # x.stop()
            x.volume = 20
            x.play_uri(alarm)
            time.sleep(22)
            x.play_uri(alarm)
            time.sleep(22)
            x.stop()
            log([song], 'not_drill', False)
            print('neo finished')

#=====================================================================================
#function for dumping data into the bucket, takes a list of songs (keys in function) and the function name being called (drill or not_drill)
def log(songList, functionName, status):
    #datetime object containing current date and time
    n = datetime.datetime.now()

    #dd/mm/YY H:M:S
    #dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    dt_string = n.strftime("%m/%d/%Y %H:%M:%S")
    print("date and time =", dt_string)

    #putting the song names, current date/time and file name into the s3 bcuket in json file format
    output={"Song names": [songList] , "Date+Time": dt_string, 'Function': functionName, 'Playing': status}
    out=json.dumps(output)
    object.put(Body=out)

def log_Tiberius(songList, functionName, status):
    #datetime object containing current date and time
    n = datetime.datetime.now()

    #dd/mm/YY H:M:S
    #dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    dt_string = n.strftime("%m/%d/%Y %H:%M:%S")
    print("date and time =", dt_string)

    #putting the song names, current date/time and file name into the s3 bcuket in json file format
    output={"Song names": [songList] , "Date+Time": dt_string, 'Function': functionName, 'Playing': status}
    out=json.dumps(output)
    object2.put(Body=out)

#=======================================================================================

#using the Soul Machine pre-recorded alarms -- playing different alarms on 'Neo Group' and 'Tiberius Sonos'
def not_drill():
    alarm = '' #alarm for Neo Group
    t_playlist = [] #Tiberius playlist

    #discovering the devices on the network
    devices = {device.player_name: device for device in soco.discover()}
    print(devices)

    #creating Neo Group and unjoining Tiberius to play separate alarms
    #===================================================
    devices['Trinity Sonos'].join(devices['Neo Sonos'])
    print(devices['Neo Sonos'].group)

    #===================================================
    devices['Leia Sonos'].join(devices['Neo Sonos'])
    print(devices['Neo Sonos'].group)

    #===================================================
    devices['Tiberius Sonos'].unjoin()
    print(devices['Neo Sonos'].group)

    #checking that Neo is in charge
    #===================================================
    print(devices['Neo Sonos'].is_coordinator)

    #presigned url for the songs in the bucket to be played with (allows correct access)
    def generate_presigned_url(bucket_name, object_key, expiry=3600):
        client = boto3.client("s3")
        try:
            response = client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,'Key': object_key},
                                                    ExpiresIn=expiry)
            return response
        except ClientError as e:
            print(e)

    #for loops to find specific song names based on their keys then adding Tiberius songs to the playlsit
    for x in bucket.objects.all():
        if x.key == 'fireburning_trim.mp3':
            a = x.key #variables used later to access key name for data bucket drop (a, b, c)
            t_playlist.append(generate_presigned_url('sonos-bucket', x.key, expiry=3600)) #adding songs to Tiberius playlist in specific order to be played (chorus, alarm, chorus)
    for x in bucket.objects.all():
        if x.key == 'tiberius_astrid_alarm.mp3':
            b = x.key
            t_playlist.append(generate_presigned_url('sonos-bucket', x.key, expiry=3600))
    for x in bucket.objects.all():
        if x.key == 'fireburning_trim.mp3':
            t_playlist.append(generate_presigned_url('sonos-bucket', x.key, expiry=3600))
    for x in bucket.objects.all():
        if x.key == 'neo_astrid_alarm.mp3': #Neo Group alarm
            c = x.key
            alarm = generate_presigned_url('sonos-bucket', x.key, expiry=3600)

    #finding speakers on the network and printing them out
    speakers = soco.discover()
    print(speakers)
    
    log([c], "not drill", True) #sending the data to the s3 bucket
    log_Tiberius([b], "not_drill", True)

    thr = threading.Thread(target=play_neo, args=(speakers, alarm, [a]), kwargs={}) #threading play_neo() and the Tiberius playlist to run at same time
    thr.start() # Will run "playneo"

    for x in speakers:
        if x.player_name == 'Tiberius Sonos': #finding Tiberius and playing the alarm playlist off it
            print("calling tiberius")
            x.volume = 10
            x.play_uri(t_playlist[0])
            time.sleep(39) #delays the next line of coding (set to 39 which is the duration of the song above)
            x.play_uri(t_playlist[1])
            time.sleep(56)
            x.play_uri(t_playlist[2])
            time.sleep(39)
            x.stop()
            log_Tiberius([b], 'not_drill', False)
            print('tiberius finished')
    thr.join() # Will wait till "playneo" is done
    print('neo and tiberius have finished')

    #time.sleep() times are set to the duration of the song above

#=================================================================================

#Playing random playlist of songs for testing purposes
def drill():

    #finding and printing oujt the devices on the network
    devices = {device.player_name: device for device in soco.discover()}
    print(devices) 

    #creating the Neo group and joining all the speakers on the network
    #====================================================
    devices['Trinity Sonos'].join(devices['Neo Sonos'])
    print(devices['Neo Sonos'].group)

    #====================================================
    devices['Leia Sonos'].join(devices['Neo Sonos'])
    print(devices['Neo Sonos'].group)

    #====================================================
    devices['Tiberius Sonos'].join(devices['Neo Sonos'])
    print(devices['Neo Sonos'].group)

    #====================================================
    print(devices['Neo Sonos'].is_coordinator)

    #empty playlist where songs to be played will be put into
    playlist = []

    # function for generating the presigned url and putting it in the playlist array
    def generate_url_playlist(bucket_name, object_key, expiry=3600):
        client = boto3.client("s3")
        try:
            response = client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,'Key': object_key},
                                                    ExpiresIn=expiry)
            playlist.append(response) #adding urls to the empty Neo Group playlist
        except ClientError as e:
            print(e)

    # generate a url for each song in the bucket
    for x in bucket.objects.all():
        if x.key != 'neo_astrid_alarm.mp3' and x.key != 'tiberius_astrid_alarm.mp3' and x.key!= 'fireburning-trim.mp3': #making sure the not_drill() designated alarms are not chosen
            a = x.key #song key variable used for log
            generate_url_playlist('sonos-bucket', x.key, expiry=3600)

    #choose random song to play
    song = random.choice(playlist) 

    log([a], "drill", True) #sending data to the s3 bucket

    #finding speakers on the network
    speakers = soco.discover()

    # play on neo (but the speakers are joined)
    for x in speakers: 
        if x.player_name == 'Neo Sonos':
            x.volume = 10
            x.play_uri(song)
            time.sleep(120)
            x.stop()
            log([a], 'drill', False)

    
#function for stopping any songs from playing
def stopPlaying():    
    devices = {device.player_name: device for device in soco.discover()}
    devices.stop()

#=============================================================================
# testing stuff ----------------------------------------

# print(speaker1.uid)
# print(speaker2.uid)
# print(speaker3.uid)

# print("---------------------------")

# #setting the playerID to variables
# #s1_id = speaker1.uid
# #s2_id = speaker2.uid
# #s3_id = speaker3.uid



# #Linking the speakers together
# devices = {device.player_name: device for device in soco.discover()}
# print(devices)
# print("---------------------------")
# print(devices['Leia Sonos'].group)

# print("--------------------------")
# devices['Trinity Sonos'].join(devices['Neo Sonos'])
# print(devices['Neo Sonos'].group)

# print("--------------------------")
# devices['Leia Sonos'].join(devices['Neo Sonos'])
# print(devices['Neo Sonos'].group)

# print("--------------------------")
# devices['Tiberius Sonos'].join(devices['Neo Sonos'])
# print(devices['Neo Sonos'].group)


# print("--------------------------")
# print(devices['Neo Sonos'].is_coordinator)

# #setting volume of group
# devices["Neo Sonos"].volume = 10
# devices['Neo Sonos'].play_uri(song)
# devices['Neo Sonos'].stop()

# def not_drill(access_key, private_key):
#     #todo
#     temp = 'true'

#drill()
not_drill()
#log(["a","b","c"], "testing")