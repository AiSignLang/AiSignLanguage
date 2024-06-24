import {ITask} from "../model/backend/ITask.ts";
import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";
import {IMistake} from "../model/backend/IMistake.ts";

class TaskService {
    public async getPer(mistake: IMistake): Promise<ITask | null>{
        try{
            const task = await fetchRestEndpoint<ITask>(`/api/tasks/task/${mistake.taskId}`, "GET");
            return task ? task : null;
        }catch (e){
            console.error(e);
            return null;
        }
    }
}

export const taskService = new TaskService();