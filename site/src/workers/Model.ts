
export interface WorkerMessage{
    type: WorkerMessageType;
    data: never;
}

export enum WorkerMessageType{
    start = "start",   
    stop = "stop",
    frame = "frame",
}