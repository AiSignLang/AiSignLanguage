import {NavService} from "../../services/NavigationService.ts";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import ToolTip from "../training/training-read/ToolTip.tsx";
import VideoPlayer from "../training/VideoPlayer.tsx";
import ReadTrainingAttachment from "../training/training-read/ReadTrainingAttachment.tsx";
import ImgPlaceholder from "../training/training-read/ImgPlaceholder.tsx";
import {ITask} from "../../model/backend/ITask.ts";

interface IProp{
    task: ITask | undefined,
    taskDone: ()=> void
}

export default function CourseRead(prop : IProp){
    NavService.changeNavHighlight(useLocation().pathname);

    const [currentVid, setCurrentVid] = useState<string>('');
    const [currentTask, setCurrentTask] = useState<ITask | undefined>(prop.task)
    useEffect(() => {
        setCurrentVid(currentTask!.videoPath);
    }, []);

    return (
        <div className="h-screen bg-bg-primary justify-center min-h-screen">
            <div className="grid grid-cols-2 w-full m-4 mt-10 p-10">
                <div className="h-full flex justify-center">
                    <ImgPlaceholder picturePath={"Studying-rafiki.png"}/>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-800 rounded-3xl">
                    <h2 className="w-1/2 text-white p-2 rounded text-center">Keep going!
                        <ToolTip solution={currentTask!.words}/>
                    </h2>

                    {currentVid && <VideoPlayer videoPath={currentVid}/>}
                    <div className="w-1/2">
                        {currentTask ?
                            <ReadTrainingAttachment changeVideo={prop.taskDone} solution={currentTask.words}/> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}