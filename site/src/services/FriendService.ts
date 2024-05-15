import {IFriend} from "../model/props.ts";

class FriendService{

    public async getFriends(){
        //const response = await fetch('http://localhost:3000/friends');
        //
        // return response.json();

        const friends: IFriend[] = [
            {
                friendID: 1,
                name: 'John Doe',
                score: {
                    scoreID: 1,
                    streak: 5,
                    allTasks: 10,
                    doneWell: 8
                },
                profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 2,
                name: 'Jane Smith',
                score: {
                    scoreID: 2,
                    streak: 2,
                    allTasks: 5,
                    doneWell: 4
                },
                profilePath:'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 3,
                name: 'Bob Johnson',
                score: {
                    scoreID: 3,
                    streak: 3,
                    allTasks: 7,
                    doneWell: 6
                },
                profilePath:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 4,
                name: 'Alice Williams',
                score: {
                    scoreID: 4,
                    streak: 1,
                    allTasks: 3,
                    doneWell: 2

                },
                profilePath:'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 5,
                name: 'Charlie Brown',
                score: {
                    scoreID: 5,
                    streak: 4,
                    allTasks: 9,
                    doneWell: 7
                },
                profilePath:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
                friendID: 6,
                name: 'Charlie Brown',
                score: {
                    scoreID: 5,
                    streak: 4,
                    allTasks: 9,
                    doneWell: 7
                },
                profilePath: null
            }
        ];
        return friends;
    }
}


export const friendService = new FriendService();