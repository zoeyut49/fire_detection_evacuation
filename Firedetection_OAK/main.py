# coding=utf-8
import json
from pathlib import Path
import argparse
import boto3
import cv2
import depthai
import numpy as np
from imutils.video import FPS
import datetime

#Parse arguments
parser = argparse.ArgumentParser()
parser.add_argument(
    "-nd", "--no-debug", action="store_true", help="prevent debug output"
)
parser.add_argument(
    "-cam",
    "--camera",
    action="store_true",
    help="Use DepthAI 4K RGB camera for inference (conflicts with -vid)",
)

parser.add_argument(
    "-vid",
    "--video",
    type=str,
    help="The path of the video file used for inference (conflicts with -cam)",
)
parser.add_argument("-akey","--accesskey",type=str,help="the access key",)

parser.add_argument("-skey","--secretkey",type=str,help="the secret key",)

args = parser.parse_args()

debug = not args.no_debug

if args.camera and args.video:
    #Error check, make sure both video and camera are not activated
    raise ValueError(
        'Command line parameter error! "-Cam" cannot be used together with "-vid"!'
    )
elif args.camera is False and args.video is None:
    #Error check, make sure that one of them is activated
    raise ValueError(
        'Missing inference source! Use "-cam" to run on DepthAI cameras, or use "-vid <path>" to run on video files'
    )


def to_planar(arr: np.ndarray, shape: tuple):
    return cv2.resize(arr, shape).transpose((2, 0, 1)).flatten()


def to_nn_result(nn_data):
    return np.array(nn_data.getFirstLayerFp16())


def to_tensor_result(packet):
    return {
        name: np.array(packet.getLayerFp16(name))
        for name in [tensor.name for tensor in packet.getRaw().tensors]
    }


def run_nn(x_in, x_out, in_dict):
    #Runs network to get data
    nn_data = depthai.NNData()
    for key in in_dict:
        nn_data.setLayer(key, in_dict[key])
    x_in.send(nn_data)
    return x_out.tryGet()


class DepthAI:
    def __init__(
        self,
        file=None,
        camera=False,
    ):
        #Initalize global vars for depthai class
        print("Loading pipeline...")
        self.file = file
        self.camera = camera
        self.fps_cam = FPS()
        self.fps_nn = FPS()
        self.create_pipeline()
        self.start_pipeline()
        self.fontScale = 1 if self.camera else 2
        self.lineType = 0 if self.camera else 3

    def create_pipeline(self):
        #Creates pipeline
        print("Creating pipeline...")
        self.pipeline = depthai.Pipeline()

        if self.camera:
            # creates ColorCamera pipeline
            print("Creating Color Camera...")
            self.cam = self.pipeline.create(depthai.node.ColorCamera)
            self.cam.setPreviewSize(self._cam_size[1], self._cam_size[0])
            self.cam.setResolution(
                depthai.ColorCameraProperties.SensorResolution.THE_4_K
            )
            self.cam.setInterleaved(False)
            self.cam.setBoardSocket(depthai.CameraBoardSocket.RGB)
            self.cam.setColorOrder(depthai.ColorCameraProperties.ColorOrder.BGR)

            self.cam_xout = self.pipeline.create(depthai.node.XLinkOut)
            self.cam_xout.setStreamName("preview")
            self.cam.preview.link(self.cam_xout.input)

        self.create_nns()

        print("Pipeline created.")

    def create_nns(self):
        pass

    def create_nn(self, model_path: str, model_name: str, first: bool = False):
        """

        :param model_path: model path
        :param model_name: model abbreviation
        :param first: Is it the first model
        :return:
        """
        # NeuralNetwork
        print(f"Creating {model_path} Neural Network...")
        model_nn = self.pipeline.create(depthai.node.NeuralNetwork)
        model_nn.setBlobPath(str(Path(f"{model_path}").resolve().absolute()))
        model_nn.input.setBlocking(False)
        if first and self.camera:
            #Get input from camera
            print("linked cam.preview to model_nn.input")
            self.cam.preview.link(model_nn.input)
        else:
            #Get input from video file on computer
            model_in = self.pipeline.create(depthai.node.XLinkIn)
            model_in.setStreamName(f"{model_name}_in")
            model_in.out.link(model_nn.input)

        model_nn_xout = self.pipeline.create(depthai.node.XLinkOut)
        model_nn_xout.setStreamName(f"{model_name}_nn")
        model_nn.out.link(model_nn_xout.input)

    def start_pipeline(self):
        #Starts pipeline
        self.device = depthai.Device(self.pipeline,usb2Mode=True)
        print("Starting pipeline...")

        self.start_nns()

        if self.camera:
            self.preview = self.device.getOutputQueue(
                name="preview", maxSize=4, blocking=False
            )

    def start_nns(self):
        pass

    def put_text(self, text, dot, color=(0, 0, 255), font_scale=None, line_type=None):
        #Puts fire % on screen when a fire is detected
        font_scale = font_scale if font_scale else self.fontScale
        line_type = line_type if line_type else self.lineType
        dot = tuple(dot[:2])
        cv2.putText(
            img=self.debug_frame,
            text=text,
            org=dot,
            fontFace=cv2.FONT_HERSHEY_COMPLEX,
            fontScale=font_scale,
            color=color,
            lineType=line_type,
        )

    def parse(self):
        #parses data
        if debug:
            self.debug_frame = self.frame.copy()

        self.parse_fun()

        if debug:
            cv2.imshow(
                "Camera_view",
                self.debug_frame,
            )
            self.fps_cam.update()
            if cv2.waitKey(1) == ord("q"):
                #Stop when q is pushed
                cv2.destroyAllWindows()
                self.fps_cam.stop()
                self.fps_nn.stop()
                print(
                    f"FPS_CAMERA: {self.fps_cam.fps():.2f} , FPS_NN: {self.fps_nn.fps():.2f}"
                )
                raise StopIteration()

    def parse_fun(self):
        pass

    def run_video(self):
        #runs a locally stored video, I only used this for testing when i did not have access to OAK
        cap = cv2.VideoCapture(str(Path(self.file).resolve().absolute()))
        while cap.isOpened():
            read_correctly, self.frame = cap.read()
            if not read_correctly:
                break

            try:
                self.parse()
            except StopIteration:
                break

        cap.release()

    def run_camera(self):
        #Runs OAK to get data
        while True:
            in_rgb = self.preview.tryGet()
            if in_rgb is not None:
                shape = (3, in_rgb.getHeight(), in_rgb.getWidth())
                self.frame = (
                    in_rgb.getData().reshape(shape).transpose(1, 2, 0).astype(np.uint8)
                )
                self.frame = np.ascontiguousarray(self.frame)
                try:
                    self.parse()
                except StopIteration:
                    break

    @property
    def cam_size(self):
        return self._cam_size

    @cam_size.setter
    def cam_size(self, v):
        self._cam_size = v

    def run(self):
        self.fps_cam.start()
        self.fps_nn.start()
        if self.file is not None:
            self.run_video()
        else:
            self.run_camera()
        del self.device


class Main(DepthAI):
    def __init__(self, file=None, camera=False):
        #Initalize global vars for main class
        self.cam_size = (255, 255)
        super().__init__(file, camera)

    def create_nns(self):
        #Create neutral network
        self.create_nn("models/fire-detection_openvino_2021.2_5shave.blob", "fire")

    def start_nns(self):
        #Start neutral network
        self.fire_in = self.device.getInputQueue("fire_in", 4, False)
        self.fire_nn = self.device.getOutputQueue("fire_nn", 4, False)

    def run_fire(self):
        #Code which detects fire
        labels = ["fire", "normal", "smoke"]
        w, h = self.frame.shape[:2]
        nn_data = run_nn(
            self.fire_in,
            self.fire_nn,
            {"Placeholder": to_planar(self.frame, (224, 224))},
        )
        if nn_data is None:
            #No data collected
            return
        self.fps_nn.update()
        results = to_tensor_result(nn_data).get("final_result")
        i = int(np.argmax(results))
        label = labels[i]
        if label == "normal":
            return
        else:
            if results[i] > 0.5:
                #If over the confidence level of 50%
                self.put_text(
                    f"{label}:{results[i]:.2f}",
                    (10, 25),
                    color=(0, 0, 255),
                    font_scale=1,
                )
                #Open a session with S3
                session=boto3.Session(
                    aws_access_key_id=args.accesskey,
                    aws_secret_access_key=args.secretkey
                )
                s3=session.resource('s3')


                file=open("firepercent.json",'a')
                x=datetime.datetime.now()
                o=label+' '+str(results[i])+ ' '+ x.strftime("%c")
                #Output for JSON
                output= {'Object':label,'Confidence':str(results[i]),'Time':x.strftime("%c"),'Room':"Neo"}
                ojson=json.dumps(output)
                json.dump(output,file,indent=2)
                file.close()
                #Send data to S3
                object=s3.Object('element212-oakd','firepercent.json')
                object.put(Body=ojson)
                #s3.Bucket('element212-oakd').upload_file('firepercent.json','firepercentlogs.json')
    def parse_fun(self):
        self.run_fire()


if __name__ == "__main__":
    if args.video:
        Main(file=args.video).run()
    else:
        Main(camera=args.camera).run()