import VideoPlayer from "./VideoPlayer.tsx";
import Navbar from "../navbar/Navbar.tsx";
import {NavService} from "../../services/NavigationService.ts";
import {useLocation} from "react-router-dom";
import {IMistake} from "../../model/backend/IMistake.ts";
import ReadTrainingAttachment from "./training-read/ReadTrainingAttachment.tsx";
import ImgPlaceholder from "./training-read/ImgPlaceholder.tsx";
import {useEffect, useState} from "react";
import {navigate} from "../../model/Utils.ts";
import ToolTip from "./training-read/ToolTip.tsx";
import {mistakeService} from "../../services/MistakeService.ts";
import {taskService} from "../../services/TaskService.ts";

/*const mistakes: IMistake[] = [
    {
        taskId: "task1",
        mistakeId: "mistake1",
        mistake: "Mistake 1",
        solution: "wir",
        userId: "user1",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        taskId: "task2",
        mistakeId: "mistake2",
        mistake: "Mistake 2",
        solution: "ich",
        userId: "user2",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        taskId: "task3",
        mistakeId: "mistake3",
        mistake: "Mistake 3",
        solution: "tschüss",
        userId: "user3",
        created_at: new Date(),
        updated_at: new Date()
    }
];

 */

function TrainingRead(){
    NavService.changeNavHighlight(useLocation().pathname);

    const [currentVid, setCurrentVid] = useState<string>('');
    const [taskVideos, setTaskVideos] = useState<string[]>([] as string[]);
    const [allMistakes, setAllMistakes] = useState([] as IMistake[])
    const [currentMistake, setCurrentMistake] = useState<IMistake>(allMistakes[0] || "")

    useEffect(() => {
        (async () => {
            const mistakes = await mistakeService.getAll();
            setAllMistakes(mistakes);
            const taskVideos = await Promise.all(mistakes.map(async (mistake) => {
                const t = await taskService.getPer(mistake);
                return t ? t.videoPath : "";
            }));
            setTaskVideos(taskVideos);
        })();

        setCurrentVid(taskVideos[0]);
    }, []);

    const changeVideo = () => {

        const index = taskVideos.indexOf(currentVid);
        const mistakeIndex = allMistakes.indexOf(currentMistake);

        const newVideo =  taskVideos[index + 1];
        const newMistake = allMistakes[mistakeIndex + 1];
        if (newVideo && newMistake) {
            setCurrentVid(newVideo);
            setCurrentMistake(newMistake);
        } else {
            navigate('/pause');
        }
    }
    return (
        <div className="h-screen bg-bg-primary justify-center min-h-screen">
            <Navbar/>
            <div className="grid grid-cols-2 w-full m-4 mt-10 p-10">

                <div className="flex flex-col items-center justify-center bg-gray-800 rounded-3xl">
                    <h2 className="w-1/2 text-white p-2 rounded text-center">Train on your mistakes!

                        {(currentMistake
                            ? (<ToolTip solution={currentMistake.solution}/>)
                            : <></>)}

                    </h2>

                    {currentVid && <VideoPlayer videoPath={currentVid}/>}
                    {!currentMistake ? <h1 className="text-white font-bold mt-10">No more mistakes to train on!</h1> : null}
                    <div className="w-1/2">
                        {currentMistake ? <ReadTrainingAttachment changeVideo={changeVideo} solution={currentMistake.solution}/> : null}
                    </div>
                </div>
                <div className="h-full flex justify-center">
                    <ImgPlaceholder picturePath={"Studying-amico.png"}/>
                </div>
            </div>
        </div>
    )
}


export default TrainingRead;