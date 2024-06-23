
interface IProp{
    videoPath:string,
}



function VideoPlayer(prop: IProp) {

    console.log("this is the video player: " + prop.videoPath);

    return (
        <div className="justify-center items-center h-screen p-10">
            <video className="rounded" controls autoPlay muted loop>
                <source src={prop.videoPath} type="video/mp4"/>
            </video>
        </div>
    )
}

export default VideoPlayer;