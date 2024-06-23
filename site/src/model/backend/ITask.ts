import {IMistake} from "./IMistake.ts";

export interface ITask {
    taskName: string;
    taskId: string;
    levelId: string;
    mistakes: IMistake[];
    created_at: Date;
    updated_at: Date;
}