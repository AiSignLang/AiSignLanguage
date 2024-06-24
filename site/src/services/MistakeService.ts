import {IMistake} from "../model/backend/IMistake.ts";
import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";

class MistakeService {
    public async getAll(): Promise<IMistake[]>{
        try{
            const mistakes = await fetchRestEndpoint<IMistake[]>("/api/mistakes", "GET");
            return mistakes ? mistakes : [];
        }catch (e){
            console.error(e);
            return [];
        }

    }
}

export const mistakeService = new MistakeService();