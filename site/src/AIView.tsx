import * as tf from '@tensorflow/tfjs';
import Webcam, {WebcamProps} from "react-webcam";
import React,{useEffect, useRef, useState} from "react";

import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {FACEMESH_TESSELATION, HAND_CONNECTIONS, Holistic, POSE_CONNECTIONS, Results} from "@mediapipe/holistic";
import {Camera} from "@mediapipe/camera_utils";
import VideoLoading from "./VideoLoading";

const AIView: React.FC = () =>{
    /*const [holistic] = useState<Holistic>(new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
    }));*/
    const holistic = new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }});
    const canvasRef = useRef<HTMLCanvasElement| null >(null);
    const videoRef = React.useRef<HTMLVideoElement|null>(null);

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        //tf.loadLayersModel('../../Model/model.json').then(model => {});
        
        holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            refineFaceLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        holistic.onResults(onResults);
        if (videoRef.current === null) return;
        
        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current === null) return;
                let timeoutId = setTimeout(() => {
                    setLoading(true); // wenns länger als 1 millisekunde dauert dann kommt loading...
                }, 200); // 1 millisecond
                
                await holistic.send({image: videoRef.current}).then(() => {
                    clearTimeout(timeoutId);
                    setLoading(false);
                });
                
            },
            width: 720,
            height: 480
        });
        camera.start();
    },  []);

    
    
    function onResults(results: Results) {
        if (canvasRef.current === null) return;
        const canvasElement = canvasRef.current;
        
        const canvasCtx = canvasElement.getContext('2d')!;
        if(canvasCtx === null) return;
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        //canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = 'source-in';
        
        //canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);

        canvasCtx.globalCompositeOperation = 'source-over';
        // Draw face connections
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
            {color: '#79a915', lineWidth: 1});
        drawLandmarks(canvasCtx, results.faceLandmarks,
            {color: '#506E79', lineWidth: 1, radius: 1});

        // Draw pose connections
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#50160A', lineWidth: 2});
        drawLandmarks(canvasCtx, results.poseLandmarks,
            {color: '#502C79', lineWidth: 2, radius: 2});

        // Draw left hand connections
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
            {color: '#79164C', lineWidth: 2});
        drawLandmarks(canvasCtx, results.leftHandLandmarks,
            {color: '#792CFA', lineWidth: 2, radius: 2});

        // Draw right hand connections
        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
            {color: '#F57542', lineWidth: 2});
        drawLandmarks(canvasCtx, results.rightHandLandmarks,
            {color: '#F542E6', lineWidth: 2, radius: 2});
        canvasCtx.restore();
    }
    
    
    return (
        <>
            <VideoLoading loading={loading} VideoRef={videoRef} />
            
            <canvas className={"transform scale-x-[-1]"} ref={canvasRef} width={"720"} height={"480"} style={{display: loading ? "none" : ""}}/>
        </>
    );
}

export default AIView;