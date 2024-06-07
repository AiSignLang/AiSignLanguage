import {ILevel} from "../model/ILevel.ts";
import {TaskType} from "../model/TaskType.ts";

class CourseService {

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
                    hints: ['https://www.google.com'],
                    taskData: ['A', 'l', 'e', 'x'],
                    skipped: false,
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
                    type: TaskType.TRANSLATION,
                    hints: ['https://www.google.com', 'https://www.google.com', 'https://www.google.com', 'https://www.google.com'],
                    taskData: ['Sie', 'sind', 'ein', 'Mensch'],
                    skipped: false,
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

}


export const courseService = new CourseService();