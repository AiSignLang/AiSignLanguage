import {WorkerMessage, WorkerMessageType} from "./Model.ts";


self.onmessage = async (event:MessageEvent<WorkerMessage>) => {
    switch (event.data.type) {
        case WorkerMessageType.start:
            onStart();
            break;
        case WorkerMessageType.stop:
            onStop();
            break;
        case WorkerMessageType.frame:
            onFrame();
            break;
    }
};

function onStart(){
    console.log('Starting PoseWorker');
    
}

function onStop() {
    console.log('Stopping PoseWorker');
    
}

function onFrame() {

}

export {};