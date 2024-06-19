﻿
import React,{useEffect, useRef, useState} from "react";

import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {FACEMESH_TESSELATION, HAND_CONNECTIONS, Holistic, POSE_CONNECTIONS, Results} from "@mediapipe/holistic";
import config from "../config.ts";


interface IProps {
    isCollecting: boolean; //! Obsolete or redundant
    collectionCallback: (res: string[]) => void;
}

export function AIView(props: IProps) {
    //const [holistic,setHolistic] = useState<Holistic|null>(null);
    const VideoWidth = 1280;
    const VideoHeight = 720;

    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const canvasRef = useRef<HTMLCanvasElement| null >(null);
    const videoRef = React.useRef<HTMLVideoElement|null>(null);
    
    const [inputVideoReady, setInputVideoReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [keypoints, setKeypoints] = useState<number[][]>([]);

    let socket = new WebSocket(config.tfServing);
    useEffect(() => {
        socket = new WebSocket(config.tfServing);
        socket.onopen = () => {
            console.log('Connected to TFServing socket');
        }
        socket.onmessage = (event) => {
            props.collectionCallback(JSON.parse(event.data));
        }
        socket.onclose = () => {
            console.log('Disconnected from TFServing socket');
        }
        console.log("init")

        // Clean up function to close the socket when the component unmounts
        return () => {
            socket.close();
        };
    }, []); // Empty dependency array ensures this runs once on mount and unmount

    let frameCountr = 0;
    function extractKeypoints(results: Results) {
        let pose: number[], face: number[], lh: number[], rh: number[];

        if (results.poseLandmarks) {
            pose = results.poseLandmarks.map(res =>
                res.x !== undefined && res.y !== undefined && res.z !== undefined && res.visibility !== undefined
                    ? [res.x, res.y, res.z, res.visibility]
                    : [0, 0, 0, 0]
            ).flat();
        } else {
            pose = new Array(33 * 4).fill(0);  // 33 landmarks * 4 values (x, y, z, visibility)
        }
        console.log("Pose length: " + pose.length);

        if (results.faceLandmarks) {
            face = results.faceLandmarks.map(res =>
                res.x !== undefined && res.y !== undefined && res.z !== undefined
                    ? [res.x, res.y, res.z]
                    : [0, 0, 0]
            ).flat();
        } else {
            face = new Array(468 * 3).fill(0);  // 468 landmarks * 3 values (x, y, z)
        }
        console.log("Face length: " + face.length);

        if (results.leftHandLandmarks) {
            lh = results.leftHandLandmarks.map(res =>
                res.x !== undefined && res.y !== undefined && res.z !== undefined
                    ? [res.x, res.y, res.z]
                    : [0, 0, 0]
            ).flat();
        } else {
            lh = new Array(21 * 3).fill(0);  // 21 landmarks * 3 values (x, y, z)
        }
        console.log("Left hand length: " + lh.length);

        if (results.rightHandLandmarks) {
            rh = results.rightHandLandmarks.map(res =>
                res.x !== undefined && res.y !== undefined && res.z !== undefined
                    ? [res.x, res.y, res.z]
                    : [0, 0, 0]
            ).flat();
        } else {
            rh = new Array(21 * 3).fill(0);  // 21 landmarks * 3 values (x, y, z)
        }
        console.log("Right hand length: " + rh.length);

        const res = [...pose, ...face, ...lh, ...rh];
        console.log("Total length: " + res.length);
        return res;
    }



    useEffect(() => {
        /*setHolistic(new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            }}));*/
    
        //tf.loadLayersModel('../../Model/model.json').then(model => {});
        if (!inputVideoReady) return;
        if (videoRef.current && canvasRef.current) {
            console.log('rendering');
            contextRef.current = canvasRef.current.getContext('2d');
            const constraints = {
                video: {width: {min: 1280}, height: {min: 720}},
            };
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                sendToMediaPipe();
            });
        }


        const holistic = new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            }
        });

        holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
        //    refineFaceLandmarks: true, //! This adds unwanted complexity and therefore changes the input shape
            minDetectionConfidence: 0.4,
            minTrackingConfidence: 0.4
        });
        holistic.onResults(onResults);

        const sendToMediaPipe = async () => {
            if (videoRef.current) {
                if (!videoRef.current.videoWidth) {
                    console.log(videoRef.current.videoWidth);
                    requestAnimationFrame(sendToMediaPipe);
                } else {
                    await holistic.send({image: videoRef.current});
                    requestAnimationFrame(sendToMediaPipe);
                }
            }
        };

    },  [inputVideoReady]);

    function onResults(results: Results) {

        if (canvasRef.current === null || contextRef.current === null) return;
        console.log(extractKeypoints(results))
        const newKeypoints = keypoints;
        newKeypoints.push(extractKeypoints(results));
        if(newKeypoints.length > 30){
            newKeypoints.shift();
        }
        frameCountr++;
  //      const newFrameCo  unt = frameCount + 1;
   //     setFrameCount(newFrameCount);
    //    console.log("RightFrames: " + newFrameCount +  "Frames: " + frameCount + " Keypoints: " + newKeypoints.length);
        console.log(frameCountr);
        console.log(socket !== null)
        if(frameCountr >= 20 && newKeypoints.length === 30 && socket !== null){
            console.log("Set to 0")
            frameCountr = 0;
            //print input shape
            console.log(newKeypoints.length);
            socket.send(JSON.stringify({instances: newKeypoints}));
      //      setFrameCount(0)
       /*     courseService.getPrediction(newKeypoints).then((res) => {
                console.log(res);
                res.json().then((data) => {
                    console.log(data);
                    props.collectionCallback(data);
                });

            });*/
        }
        setKeypoints(newKeypoints);
        
        //canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);
        setLoaded(true);
        contextRef.current.save();
        contextRef.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
        
        contextRef.current.drawImage(
            results.image,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
        // Only overwrite existing pixels.
        
        //canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        // Draw face connections
        drawConnectors(contextRef.current, results.faceLandmarks, FACEMESH_TESSELATION,
            {color: '#79a915', lineWidth: 1});
        drawLandmarks(contextRef.current, results.faceLandmarks,
            {color: '#506E79', lineWidth: 1, radius: 1});

        // Draw pose connections
        drawConnectors(contextRef.current, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#50160A', lineWidth: 2});
        drawLandmarks(contextRef.current, results.poseLandmarks,
            {color: '#502C79', lineWidth: 2, radius: 2});

        // Draw left hand connections
        drawConnectors(contextRef.current, results.leftHandLandmarks, HAND_CONNECTIONS,
            {color: '#79164C', lineWidth: 2});
        drawLandmarks(contextRef.current, results.leftHandLandmarks,
            {color: '#792CFA', lineWidth: 2, radius: 2});

        // Draw right hand connections
        drawConnectors(contextRef.current, results.rightHandLandmarks, HAND_CONNECTIONS,
            {color: '#F57542', lineWidth: 2});
        drawLandmarks(contextRef.current, results.rightHandLandmarks,
            {color: '#F542E6', lineWidth: 2, radius: 2});
        contextRef.current.restore();
    }
    
    
    return (
        <>
            <div
                className={"relative items-center block bg-white dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700"}
                style={{width: VideoWidth, height: VideoHeight}}>
                <video autoPlay ref={(el) => {
                    videoRef.current = el;
                    setInputVideoReady(!!el);
                }} className={`${loaded ? 'hidden' : 'opacity-55'} transform scale-x-[-1]`}>
                </video>
                <canvas className={`scale-x-[-1] absolute transform left-0 top-0 bg-transparent ${loaded?'':'hidden'}`} ref={canvasRef}
                        width={videoRef.current?.videoWidth ?? VideoWidth}
                        height={videoRef.current?.videoHeight ?? VideoHeight}/>
                <div role="status" className={`${loaded ? 'hidden' : ''} absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2`}>
                    <svg aria-hidden="true" className={"w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"}
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className={"sr-only"}>Loading...</span>
                </div>
            </div>
            
        </>
    );
}

export default AIView;