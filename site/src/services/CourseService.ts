import {ILevel} from "../model/backend/ILevel.ts";
import {TaskType} from "../model/TaskType.ts";
import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";
import config from "../config.ts";
import {StatusCodes} from "http-status-codes";
type TaskTuple = [number, number];


class CourseService {
    public getDoneTasksCount(): TaskTuple[] {
        const sessionUser = sessionStorage.getItem('user');
        if(!sessionUser){
            return []; //! TODO Renaviagte to login
        }
        const user = JSON.parse(sessionUser);
        console.log(user);
        return [];
    }
    public async getNextLevel() {
        const sessionUser = sessionStorage.getItem('user');
        if(!sessionUser){
            return null; //! TODO Renaviagte to login
        }
        return await fetchRestEndpoint<ILevel>(`${config.externalAddress}/api/levels/next`, "GET", undefined, true,(code:StatusCodes) => {   console.log("Error", code);});
    }

    public async completeLevel(levelNumber: string) {
        const sessionUser = sessionStorage.getItem('user');
        if(!sessionUser){
            return null; //! TODO Renaviagte to login
        }
        return await fetchRestEndpoint<ILevel>(`${config.externalAddress}/api/levels/${levelNumber}/complete`, "POST", undefined, true,(code:StatusCodes) => {   console.log("Error", code);});
    }

    public isVisualTask(taskType: TaskType) {
        const visualTasks = {
            [TaskType.SPELLING]: true,
            [TaskType.RECOGNITION]: false,
            [TaskType.TRANSLATION]: true,
        };

        return visualTasks[taskType];
    }

    public getPrediction(taskData: (number[])[]) {
        console.log(taskData.length);
        return fetch('http://localhost:5002/ai/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({instances: taskData})
        });
    }
}


export const courseService = new CourseService();