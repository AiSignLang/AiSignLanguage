import {TaskType} from "../TaskType.ts";

export interface ITask {
    taskName: string;
    taskId: string;
    levelId: string;
    videoPath: string;
    words: string;
    tfSolution: string;
    type: TaskType | null;
    created_at: Date;
    updated_at: Date;
}