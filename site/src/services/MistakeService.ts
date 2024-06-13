import {IMistake} from "../model/IMistake.ts";
//import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";


class MistakeService{
    //private route: string = 'http://localhost:3000/api/task';

    // TODO: this method gets ID and returns user object + needs to be switched down below
    // TODO: change route as needed
    public async getTasks(userId: string): Promise<IMistake[] | null>{

        console.log(userId);
        //await fetchRestEndpoint(this.route, 'GET')
        // hmm, okay mistakes per level, should have layer of tasks per level
        const mistakes: IMistake[] = [
            {
                mistakeID: 1,
                taskID: 1,
                mistake: "D",
                solution: "Du",
            },
            {
                mistakeID: 2,
                taskID: 1,
                mistake: "H",
                solution: "Hallo",
            },
            {
                mistakeID: 3,
                taskID: 2,
                mistake: "W",
                solution: "Welt",
            },
            {
                mistakeID: 4,
                taskID: 3,
                mistake: "Hallo",
                solution: "Guten Tag",
            }

        ]
        return mistakes;
    }
}


export const mistakeService = new MistakeService();