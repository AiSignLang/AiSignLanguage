import * as tf from '@tensorflow/tfjs';
import Webcam, {WebcamProps} from "react-webcam";
import React,{useEffect, useRef, useState} from "react";

import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {FACEMESH_TESSELATION, HAND_CONNECTIONS, Holistic, POSE_CONNECTIONS, Results} from "@mediapipe/holistic";
import {Camera} from "@mediapipe/camera_utils";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
};

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
    const canvasRef = useRef<HTMLCanvasElement >(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);

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
                await holistic.send({image: videoRef.current}).then(()=>setLoading(false));
                
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
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#0077ff', lineWidth: 4});
        drawLandmarks(canvasCtx, results.poseLandmarks,
            {color: '#FF0000', lineWidth: 2});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
            {color: '#C0C0C070', lineWidth: 1});
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
            {color: '#CC0000', lineWidth: 5});
        drawLandmarks(canvasCtx, results.leftHandLandmarks,
            {color: '#00FF00', lineWidth: 2});
        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
            {color: '#00CC00', lineWidth: 5});
        drawLandmarks(canvasCtx, results.rightHandLandmarks,
            {color: '#FF0000', lineWidth: 2});
        canvasCtx.restore();
    }
    
    
    return (
        <>
            <video ref={videoRef} className={"transform scale-x-[-1]"} style={{display: loading?"":"none"}}/>
            <div role="status">
                <svg aria-hidden="true"
                     className={"inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"}
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
            <canvas className={"transform scale-x-[-1]"} ref={canvasRef} width={"720"} height={"480"} style={{display: loading ? "none" : ""}}/>
        </>
    );
}

export default AIView;