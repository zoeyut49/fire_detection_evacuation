#!/usr/bin/env python3
from datetime import datetime
import json
from pathlib import Path
import boto3
import blobconverter
import cv2
import depthai as dai
import numpy as np
import argparse
from time import monotonic
import itertools
from depthai_sdk import PipelineManager, NNetManager, PreviewManager
from depthai_sdk import cropToAspectRatio
import datetime
parentDir = Path(__file__).parent

#=====================================================================================
# To use a different NN, change `size` and `nnPath` here:
size = (544, 320)
nnPath = blobconverter.from_zoo("person-detection-retail-0013", shaves=8)
#=====================================================================================

# Labels
labelMap = ["background", "person"]

# Get argument first
parser = argparse.ArgumentParser()
parser.add_argument('-nn', '--nn', type=str, help=".blob path")
parser.add_argument('-i', '--image', type=str,
                    help="Path to an image file to be used for inference (conflicts with -cam)")
parser.add_argument('-cam', '--camera', action="store_true",
                    help="Use DepthAI RGB camera for inference (conflicts with -vid)")
parser.add_argument("-akey","--accesskey",type=str,help="the access key",)

parser.add_argument("-skey","--secretkey",type=str,help="the secret key",)
args = parser.parse_args()

# Whether we want to use images from host or rgb camera
# When image is true, then not using camera, used for testing when not able to access OAK
IMAGE = not args.camera
nnSource = "host" if IMAGE else "color"

# Start defining a pipeline
pm = PipelineManager()
if not IMAGE:
    #Camera is being used
    pm.createColorCam(previewSize=size, xout=True)
    pv = PreviewManager(display=["color"], nnSource=nnSource)
#Open network manager, which is used for data input
nm = NNetManager(inputSize=size, nnFamily="mobilenet", labels=labelMap, confidence=0.5)
nn = nm.createNN(pm.pipeline, pm.nodes, blobPath=nnPath, source=nnSource)
pm.setNnManager(nm)
pm.addNn(nn)

# Pipeline defined, now the device is connected to
with dai.Device(pm.pipeline,usb2Mode=True) as device:
    nm.createQueues(device)
    if IMAGE:
        #Used when not using camera, I only used it for testing
        imgPaths = [args.image] if args.image else list(parentDir.glob('images/*.jpeg'))
        og_frames = itertools.cycle([cropToAspectRatio(cv2.imread(str(imgPath)), size) for imgPath in imgPaths])
    else:
        #Used when using camera, 
        pv.createQueues(device)

    while True:
        #Loops, getting people count data in, and outputting to AWS
        if IMAGE:
            frame = next(og_frames).copy()
            nm.sendInputFrame(frame)
        else:
            pv.prepareFrames(blocking=True)
            frame = pv.get("color")

        nn_data = nm.decode(nm.outputQueue.get())
        nm.draw(frame, nn_data)
        cv2.putText(frame, f"People count: {len(nn_data)}", (5, 30), cv2.FONT_HERSHEY_TRIPLEX, 1, (0,0,255))
        cv2.imshow("color", frame)
        if len(nn_data) > 0: 
            #Only upload to AWS/storage file if >0 people are seen
            f=open("outputfile.json","a")
            session=boto3.Session(aws_access_key_id=args.accesskey,aws_secret_access_key=args.secretkey)
            s3=session.resource('s3')
            object=s3.Object('element212-oakd-human','outputfile.json')
            x=datetime.datetime.now()
            o={'People Count':str(len(nn_data)),'Time':x.strftime('%c'),'Room':'Tiberius'}
            data=json.dumps(o)
            result=object.put(Body=data)
            #f.write(str(len(nn_data)))
            json.dump(o,f)
            f.close()
            #s3.Bucket('element212-oakd-human').upload_file('outputfile.json','peoplecountlogs.json')
        if cv2.waitKey(3000 if IMAGE else 1) == ord('q'):
            break
            #breaks when q is pressed, ends program