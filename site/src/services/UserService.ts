import {IUser} from "../model/props.ts";
//import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";


class UserService{
    //private route: string = 'http://localhost:3000/api/user';

    // TODO: this method gets ID and returns user object + needs to be switched down below
    // TODO: change route as needed
    public async getUser(){

        //await fetchRestEndpoint(this.route, 'GET')
        const user: IUser = {
            id: 1,
            name: 'John Doe',
            score: {
                scoreID: 1,
                streak: 5,
                allTasks: 10,
                doneWell: 8
            },
            profilePath:"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

        }
        return user;
    }
}


export const userService = new UserService();