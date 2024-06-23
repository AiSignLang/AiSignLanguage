import {ITask} from "../model/ITask.ts";
import {TaskType} from "../model/TaskType.ts";
//import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";



class TaskService{
    //private route: string = 'http://localhost:3000/api/task';

    // TODO: this method gets ID and returns user object + needs to be switched down below
    // TODO: change route as needed
    public async getTasks(levelId: string): Promise<ITask[] | null>{

        console.log(levelId);
        //await fetchRestEndpoint(this.route, 'GET')
        const tasks: ITask[] = [
            {
            taskID: 1,
            levelID: 1,
            type: TaskType.SPELLING,
            skipped: false,
            hints: [],
            taskData: ["Du"],
            mistakes: null
            },
            {
                taskID: 2,
                levelID: 1,
                type: TaskType.SPELLING,
                skipped: false,
                hints: ["Hint1", "Hint2"],
                taskData: ["Hallo"],
                mistakes: null
            },
            {
                taskID: 3,
                levelID: 2,
                type: TaskType.SPELLING,
                skipped: true,
                hints: [],
                taskData: ["Welt"],
                mistakes: null
            },
            {
                taskID: 4,
                levelID: 2,
                type: TaskType.SPELLING,
                skipped: false,
                hints: ["Hint3"],
                taskData: ["Guten", "Tag"],
                mistakes: null
            }
        ]
        return tasks;
    }
}


export const taskService = new TaskService();