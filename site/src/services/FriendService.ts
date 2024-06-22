import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";
import config from "../config.ts";
//import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";

class FriendService{

    public async getSuggestions(){
        const sessionUser = sessionStorage.getItem('user');
        if(!sessionUser){
            return []; //! TODO Renaviagte to login
        }
        const username = JSON.parse(sessionUser).userName;
        let users: IUser[] | undefined = await fetchRestEndpoint<IUser[]>(`${config.externalAddress}/api/friends/${username}/suggestions`, "GET",undefined);
        if(!users) {
            users = [];
        }
        return users;
    }
    public async addFriend(friendUsername: string){
        const sessionUser = sessionStorage.getItem('user');
        if(!sessionUser){
            return; //! TODO Renaviagte to login
        }
        const username = JSON.parse(sessionUser).userName; //! TODO Nächste Zeile könnte krachen
        await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/friends/${username}/friends/${friendUsername}`, "POST",undefined);
    }
    public async removeFriend(friendUsername: string){
        const sessionUser = sessionStorage.getItem('user');
        if(!sessionUser){
            return; //! TODO Renaviagte to login
        }
        const username = JSON.parse(sessionUser).userName; //! TODO Nächste Zeile könnte krachen
        await fetchRestEndpoint<IUser>(`${config.externalAddress}/api/friends/${username}/friends/${friendUsername}`, "DELETE",undefined);
    }
    public async getFriends(){
        const sessionUser = sessionStorage.getItem('user');
        if(!sessionUser){
            return []; //! TODO Renaviagte to login
        }
       const users: IUser[] = JSON.parse(sessionUser).friends;
        return users;
    }

    /*private mapUsersToFriends(users: IUser[]): IFriend[] {
        return users.map(user => ({
            friendID: parseInt(user.userId),
            name: user.userName,
            score: {
                scoreId: parseInt(user.score.scoreId),
                dailyStreak: user.score.dailyStreak,
                allTimeCorrect: user.score.allTimeCorrect,
                perfectlyDone: user.score.perfectlyDone
            },
            profilePath: user.profilePic,
        }));
    }
     */
}


export const friendService = new FriendService();