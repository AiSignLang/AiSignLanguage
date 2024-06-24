import CourseRead from "./CourseRead.tsx";
import {ITask} from "../../model/backend/ITask.ts";
import {TaskType} from "../../model/TaskType.ts";

/*
* export interface ITask {
    taskName: string;
    taskId: string;
    levelId: string;
    videoPath: string;
    words: string;
    tfSolution: string;
    type: TaskType | null;
    created_at: Date;
    updated_at: Date;
}
* */

const taskDone = () =>
{
    alert("task is done");
}
export default function MistComponent(){

    //const [random, setRandom] = useState<number>(Math.round(Math.random()));

    const task: ITask = {
        taskName: "Ich",
        taskId: "dfasdfaeoij-lk-jaösdf--",
        levelId: "level1",
        videoPath: "https://media.spreadthesign.com/video/mp4/22/135514.mp4",
        words: "ich",
        tfSolution: "ich",
        type: TaskType.RECOGNITION,
        created_at: new Date(),
        updated_at: new Date()
    }
    //setRandom(Math.round(Math.random()));
    return(
        <>
            <CourseRead task={task} taskDone={taskDone}></CourseRead>
            {/*random === 0 ? (<CourseRead task={task} taskDone={taskDone}></CourseRead>) : (<>YOUR EXERCISE PART</>)*/}
        </>
    )

}