import {Exercise} from "../exercise/Exercise.tsx";
//import {IMistake} from "../../model/IMistake.ts";
import {NavService} from "../../services/NavigationService.ts";
import {useLocation} from "react-router-dom";

function TrainingSign(){

    NavService.changeNavHighlight(useLocation().pathname);

    /*const mistakes: IMistake[] = [
        {
            mistakeID: 1,
            taskID: 1,
            mistake: "mistake1",
            solution: "correct1"
        },
        {
            mistakeID: 2,
            taskID: 1,
            mistake: "mistake2",
            solution: "correct2"
        },
        {
            mistakeID: 3,
            taskID: 2,
            mistake: "mistake3",
            solution: "correct3"
        }
    ]*/
    return (
        <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full items-center">

            <Exercise></Exercise>

            <h1 className="font-bold text-2xl bg-primary w-fit p-3.5 rounded">Train on your
                mistakes!</h1>
        </div>
    )
}

export default TrainingSign;