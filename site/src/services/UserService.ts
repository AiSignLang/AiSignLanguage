import {IUser} from "../model/props.ts";
import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";
import config from "../config.ts";
//import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";


class UserService{
    //private route: string = 'http://localhost:3000/api/user';

    // TODO: this method gets ID and returns user object + needs to be switched down below
    // TODO: change route as needed
    public async getUser(username: string): Promise<IUser | null>{
        const user = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/${username}`, "GET");
        console.log(user);
        if (user) {
            return user;
        }
        return null;
    }
}


export const userService = new UserService();