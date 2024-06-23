import {TaskType} from "./TaskType.ts";
import {IMistake} from "./IMistake.ts";

export interface ITask{
    taskID: number;
    levelID: number;
    type: TaskType;
    skipped: boolean;
    hints: string[]; // Should be URLS for images
    taskData: string[]; //Should be phrase, for phrase, each being translatable with only one sign
    mistakes: IMistake[] | null;
}