import VideoPlayer from "./VideoPlayer.tsx";
import Navbar from "../navbar/Navbar.tsx";
import {NavService} from "../../services/NavigationService.ts";
import {useLocation} from "react-router-dom";
import {IMistake} from "../../model/backend/IMistake.ts";
import ReadTrainingAttachment from "./training-read/ReadTrainingAttachment.tsx";
import ImgPlaceholder from "./training-read/ImgPlaceholder.tsx";
import {useEffect, useState} from "react";
import {navigate} from "../../model/Utils.ts";
import {fetchRestEndpoint} from "../../support/FetchEndpoint.ts";

const mistakes: IMistake[] = [
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
        solution: "Solution 2",
        userId: "user2",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        taskId: "task3",
        mistakeId: "mistake3",
        mistake: "Mistake 3",
        solution: "Solution 3",
        userId: "user3",
        created_at: new Date(),
        updated_at: new Date()
    }
];


function TrainingRead(){
    NavService.changeNavHighlight(useLocation().pathname);

    const [currentVid, setCurrentVid] = useState('');
    const [taskVideos, setTaskVideos] = useState([] as string[]);
    useEffect(() => {
        fetchRestEndpoint<>()
        setTaskVideos(mistakes.map((mistake) => {
            //fetchRestEndpoint()
            console.log(mistake);
            return 'https://media.spreadthesign.com/video/mp4/22/232422.mp4';
        }))
        // todo: with the stored taskId get the task, in the task is the video path, set that
        // or get all the tasks instantly, and set it
        setCurrentVid('https://media.spreadthesign.com/video/mp4/22/232422.mp4');
    }, []);

    const changeVideo = () => {
        console.log('curry video '+currentVid);

        const index = taskVideos.indexOf(currentVid);
        const newVideo =  taskVideos[index + 1];
        console.log(index + " " + newVideo);
        if (newVideo) {
            setCurrentVid(newVideo);
        } else {
            navigate('/training');
            // TODO:
        }
    }
    return (

        <div className="h-screen bg-bg-secondary">
            <Navbar/>
            {currentVid && <VideoPlayer videoPath={currentVid}/>}
            <ReadTrainingAttachment changeVideo={changeVideo} mistake={mistakes[0]}/>
            <ImgPlaceholder/>
        </div>
    )
}


export default TrainingRead;