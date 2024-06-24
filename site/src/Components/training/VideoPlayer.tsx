import {useEffect, useRef} from "react";

interface IProp{
    videoPath:string,
}



function VideoPlayer(prop: IProp){
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [prop.videoPath]);

    return (

        <video className="w-1/2 flex rounded-md"
               ref={videoRef} controls loop autoPlay muted>
            <source src={prop.videoPath} type="video/mp4"/>
        </video>
    );
}

export default VideoPlayer;