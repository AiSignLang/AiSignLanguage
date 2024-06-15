import {IUser} from "../model/props.ts";
import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";
import config from "../config.ts";
import {StatusCodes} from "http-status-codes";
//import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";


class UserService{
    //private route: string = 'http://localhost:3000/api/user';

    // TODO: this method gets ID and returns user object + needs to be switched down below
    // TODO: change route as needed
    public async getUser(username: string,onUnauthorized?:()=>void): Promise<IUser | null>{
        try{
            const user = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/${username}`, "GET",undefined,(err:StatusCodes)=>
            {
                if(err === StatusCodes.UNAUTHORIZED){
                    onUnauthorized?.();
                }
            });
            if (user) {
                console.log(user);
                sessionStorage.setItem('user', JSON.stringify(user));
                return user;
            }
            return null;
            
        }catch (e){
            console.error(e);
            return null;
        }
    }
}


export const userService = new UserService();