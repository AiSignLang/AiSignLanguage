import {ITask} from "./ITask.ts";

export interface ILevel {
    levelName: string;
    levelId: string;
    tasks: ITask[];
}