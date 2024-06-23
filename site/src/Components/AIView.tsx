import { useEffect, useRef, useState } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { FACEMESH_TESSELATION, HAND_CONNECTIONS, Holistic, POSE_CONNECTIONS, Results } from "@mediapipe/holistic";
import useWebSocket, { ReadyState } from "react-use-websocket";
import config from "../config.ts";
import {courseService} from "../services/CourseService.ts";

interface IProps {
    collectionCallback: (data: {classes: string[],probabilities: number[]}) => void;
}

export function AIView(props: IProps) {
    const VideoWidth = 1280;
    const VideoHeight = 720;

    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [inputVideoReady, setInputVideoReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>("");
    const [buttonisDisabled, setButtonisDisabled] = useState<boolean>(false);

    const [rerender, setRerender] = useState<boolean>(false);
    const drawKeypoints = useRef(true);
    const isRecordingRef = useRef(false);
    const recordedFrames = useRef<number[][]>([]);
    const frameCountRef = useRef(0);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setCameras(videoDevices);
            if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
        });
    }, []);

    useEffect(() => {
        if (!inputVideoReady || !selectedCamera) return;

        if (videoRef.current && canvasRef.current) {
            contextRef.current = canvasRef.current.getContext('2d');

            navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCamera, width: { min: 1280 }, height: { min: 720 } } }).then((stream) => {
                if (videoRef.current) videoRef.current.srcObject = stream;
                sendToMediaPipe();
            });

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
                minDetectionConfidence: 0.4,
                minTrackingConfidence: 0.4
            });

            holistic.onResults(onResults);

            const sendToMediaPipe = async () => {
                if (videoRef.current) {
                    if (!videoRef.current.videoWidth) {
                        requestAnimationFrame(sendToMediaPipe);
                    } else {
                        await holistic.send({ image: videoRef.current });
                        requestAnimationFrame(sendToMediaPipe);
                    }
                }
            };
        }
    }, [inputVideoReady, selectedCamera, isRecordingRef.current]);

    function extractKeypoints(results: Results) {
        const defaultPose = new Array(33 * 4).fill(0);
        const defaultFace = new Array(468 * 3).fill(0);
        const defaultHand = new Array(21 * 3).fill(0);

        const pose = results.poseLandmarks ? results.poseLandmarks.flatMap(res =>
            [res.x ?? 0, res.y ?? 0, res.z ?? 0, res.visibility ?? 0]
        ) : defaultPose;

        const face = results.faceLandmarks ? results.faceLandmarks.flatMap(res =>
            [res.x ?? 0, res.y ?? 0, res.z ?? 0]
        ) : defaultFace;

        const leftHand = results.leftHandLandmarks ? results.leftHandLandmarks.flatMap(res =>
            [res.x ?? 0, res.y ?? 0, res.z ?? 0]
        ) : defaultHand;

        const rightHand = results.rightHandLandmarks ? results.rightHandLandmarks.flatMap(res =>
            [res.x ?? 0, res.y ?? 0, res.z ?? 0]
        ) : defaultHand;

        return [...pose, ...face, ...leftHand, ...rightHand];
    }

    function onResults(results: Results) {
        if (!canvasRef.current || !contextRef.current) return;
        setLoaded(true);

        contextRef.current.save();
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        contextRef.current.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (drawKeypoints.current) {
            drawConnectors(contextRef.current, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#79a915', lineWidth: 1 });
            drawLandmarks(contextRef.current, results.faceLandmarks, { color: '#506E79', lineWidth: 1, radius: 1 });
            drawConnectors(contextRef.current, results.poseLandmarks, POSE_CONNECTIONS, { color: '#50160A', lineWidth: 2 });
            drawLandmarks(contextRef.current, results.poseLandmarks, { color: '#502C79', lineWidth: 2, radius: 2 });
            drawConnectors(contextRef.current, results.leftHandLandmarks, HAND_CONNECTIONS, { color: '#79164C', lineWidth: 2 });
            drawLandmarks(contextRef.current, results.leftHandLandmarks, { color: '#792CFA', lineWidth: 2, radius: 2 });
            drawConnectors(contextRef.current, results.rightHandLandmarks, HAND_CONNECTIONS, { color: '#F57542', lineWidth: 2 });
            drawLandmarks(contextRef.current, results.rightHandLandmarks, { color: '#F542E6', lineWidth: 2, radius: 2 });
        }

        contextRef.current.restore();

        console.log("Results:", isRecordingRef.current);
        if (isRecordingRef.current && frameCountRef.current < 30) {
            recordedFrames.current.push(extractKeypoints(results));
            frameCountRef.current++;

            if (frameCountRef.current >= 30) {
                console.log("Logging 30 frames:", recordedFrames);
                isRecordingRef.current = false; // Stop recording after logging
                frameCountRef.current = 0; // Reset frame count
                recordedFrames.current = []; // Reset recorded frames
                setButtonisDisabled(false);
                courseService.getPrediction(recordedFrames.current).then(res => {
                    res.json().then(data => {
                        if(data && data.classes && data.probabilities && data.classes.length === data.probabilities.length){
                            props.collectionCallback({classes: data.classes, probabilities: data.probabilities});
                        }
                    });
                });
            }
        }
    }

    const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCamera(event.target.value);
    };

    const startRecording = () => {
        isRecordingRef.current = true;
        setButtonisDisabled(true);
        frameCountRef.current = 0;
        recordedFrames.current = [];
    };

    const toggleDrawKeypoints = () => {
        drawKeypoints.current = !drawKeypoints.current;
        setRerender(true);
    };

    useEffect(() => {
        setRerender(false);
    }, [rerender]);
    return (
        <div className="relative items-center block bg-white dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700" style={{ width: VideoWidth, height: VideoHeight }}>
            <div className="absolute top-2 right-2 z-10">
                <select value={selectedCamera} onChange={handleCameraChange}
                        className="bg-bg-secondary text-text-primary p-2 rounded">
                    {cameras.map((camera, index) => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${index + 1}`}
                        </option>
                    ))}
                </select>
                {buttonisDisabled ? (
                    <button disabled className="ml-2 bg-btn-bg-disable text-white p-2 rounded">
                        Start Recording
                    </button>
                ) : (
                    <button onClick={startRecording} className="ml-2 bg-blue-500 text-white p-2 rounded">
                        Start Recording
                    </button>
                )}
                <div>
                    <input
                        className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                        type="checkbox"
                        role="switch"
                        onChange={toggleDrawKeypoints}
                        checked={drawKeypoints.current}
                        id="flexSwitchCheckDefault"/>
                    <label
                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="flexSwitchCheckDefault"
                    >Default switch checkbox input</label>
                </div>

            </div>
            <video autoPlay ref={(el) => {
                videoRef.current = el;
                setInputVideoReady(!!el);
            }} className={`${loaded ? 'hidden' : 'opacity-55'} transform scale-x-[-1]`}/>
            <canvas className={`scale-x-[-1] absolute transform left-0 top-0 bg-transparent ${loaded ? '' : 'hidden'}`}
                    ref={canvasRef} width={videoRef.current?.videoWidth ?? VideoWidth}
                    height={videoRef.current?.videoHeight ?? VideoHeight}/>
            <div role="status"
                 className={`${loaded ? 'hidden' : ''} absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2`}>
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"/>
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default AIView;
