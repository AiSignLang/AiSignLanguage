import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";
import config from "../config.ts";
import {StatusCodes} from "http-status-codes";
import {IUser} from "../model/backend/IUser.ts";
//import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";


class UserService{
    //private route: string = 'http://localhost:3000/api/user';

    // TODO: this method gets ID and returns user object + needs to be switched down below
    // TODO: change route as needed
    public async getUser(username: string,onUnauthorized?:()=>void): Promise<IUser | null>{
        try{
            const user = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/${username}`, "GET",undefined,true,(err:StatusCodes)=>
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
    public async getMe(onUnauthorized?:()=>void): Promise<IUser | null>{
        try{
            const user = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/me`, "GET",undefined,true,(err:StatusCodes)=>
            {
                if(err === StatusCodes.UNAUTHORIZED){
                    onUnauthorized?.();
                }
            });
            if (user) {
                console.log(user);
                return user;
            }
            return null;
            
        }catch (e){
            console.error(e);
            return null;
        }
    }
    
    public async validateUsername(username: string): Promise<boolean>{
        try{
            await fetchRestEndpoint<void>(`${config.externalAddress}/api/user/validate-username`, "POST", {username});
            
        }catch (e){
            console.error(e);
            return false;
        }
        return true;
    }
    public async patchUser(username: string, data: Partial<IUser>,onUnauthorized?:()=>void): Promise<IUser | null>{
        try{
            const user = await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/user/${username}`, "PATCH", data,true,(err:StatusCodes)=>
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