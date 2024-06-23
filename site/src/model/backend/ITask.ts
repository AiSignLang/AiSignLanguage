interface ITask {
    taskName: string;
    taskId: string;
    levelId: string;
    mistakes: IMistake[];
    created_at: Date;
    updated_at: Date;
}