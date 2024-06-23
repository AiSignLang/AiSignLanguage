import {ITask} from "./ITask.ts";

export interface ILevel{
    levelID: number;
    isTraining: boolean;
    tasks: ITask[];
}