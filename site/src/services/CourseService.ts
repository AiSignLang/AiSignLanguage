import {IFriend} from "../model/props.ts";
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
                    solution: ['https://www.google.com'],
                    taskData: ['A', 'l', 'e', 'x']
                },
                {
                    taskID: 2,
                    levelID: 1,
                    type: TaskType.TRANSLATION,
                    solution: ['https://www.google.com'],
                    taskData: ['World']
                },
                {
                    taskID: 3,
                    levelID: 1,
                    type: TaskType.TRANSLATION,
                    solution: ['https://www.google.com', 'https://www.google.com', 'https://www.google.com', 'https://www.google.com'],
                    taskData: ['Sie', 'sind', 'ein', 'Mensch']
                }
            ]
        };

        return level
    }

}


export const courseService = new CourseService();