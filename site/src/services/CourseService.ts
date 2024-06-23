import {ILevel} from "../model/ILevel.ts";
import {TaskType} from "../model/TaskType.ts";
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
        //Instance of ILevel
        const level: ILevel = {
            levelID: 1,
            isTraining: true,
            tasks: [
                {
                    taskID: 1,
                    levelID: 1,
                    type: TaskType.SPELLING,
                    skipped: false,
                    hints: ['https://www.google.com'],
                    taskData: ['A', 'l', 'e', 'x'],
                    mistakes: null
                },
                {
                    taskID: 2,
                    levelID: 1,
                    type: TaskType.TRANSLATION,
                    hints: ['https://www.google.com'],
                    taskData: ['World'],
                    skipped: false,
                    mistakes: null
                },

                {
                    taskID: 3,
                    levelID: 1,
                    skipped: false,
                    type: TaskType.TRANSLATION,
                    hints: ['https://www.google.com', 'https://www.google.com', 'https://www.google.com', 'https://www.google.com'],
                    taskData: ['Sie', 'sind', 'ein', 'Mensch'],
                    mistakes: null
                }
            ]
        };
        console.log(level);
        return level
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
        return fetch('http://localhost:8501/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({instances: taskData})
        });
    }
}


export const courseService = new CourseService();