import {TaskType} from "./TaskType.ts";

export interface ITask{
    taskID: number;
    levelID: number;
    type: TaskType;
    solution: string[]; // Should be URLS for images
    taskData: string[]; //Should be phrase, for phrase, each being translatable with only one sign
}