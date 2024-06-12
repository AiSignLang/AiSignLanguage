import {IFriend} from "../model/props.ts";
import {fetchRestEndpoint} from "../support/FetchEndpoint.ts";

class FriendService{

    public async getSuggestions(){

        const friends: IFriend[] = [
            {
                friendID: 1,
                name: 'John Doe',
                score: {
                    scoreId: 1,
                    dailyStreak: 5,
                    allTimeCorrect: 10,
                    perfectlyDone: 8
                },
                profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 2,
                name: 'Jane Smith',
                score: {
                    scoreId: 2,
                    dailyStreak: 2,
                    allTimeCorrect: 5,
                    perfectlyDone: 4
                },
                profilePath:'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 3,
                name: 'Bob Johnson',
                score: {
                    scoreId: 3,
                    dailyStreak: 3,
                    allTimeCorrect: 7,
                    perfectlyDone: 6
                },
                profilePath:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 4,
                name: 'Alice Williams',
                score: {
                    scoreId: 4,
                    dailyStreak: 1,
                    allTimeCorrect: 3,
                    perfectlyDone: 2

                },
                profilePath:'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 5,
                name: 'Charlie Brown',
                score: {
                    scoreId: 5,
                    dailyStreak: 4,
                    allTimeCorrect: 9,
                    perfectlyDone: 7
                },
                profilePath:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
                friendID: 6,
                name: 'Charlie Brown',
                score: {
                    scoreId: 5,
                    dailyStreak: 4,
                    allTimeCorrect: 9,
                    perfectlyDone: 7
                },
                profilePath: null
            }
        ];
        return friends;
    }

    public async getFriends(){
        const response = await fetchRestEndpoint('http://localhost:3000/friends',"GET");
        //
        // return response.json();

        const friends: IFriend[] = [
            {
                friendID: 1,
                name: 'John Doe',
                score: {
                    scoreId: 1,
                    dailyStreak: 5,
                    allTimeCorrect: 10,
                    perfectlyDone: 8
                },
                profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 2,
                name: 'Jane Smith',
                score: {
                    scoreId: 2,
                    dailyStreak: 2,
                    allTimeCorrect: 5,
                    perfectlyDone: 4
                },
                profilePath:'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 3,
                name: 'Bob Johnson',
                score: {
                    scoreId: 3,
                    dailyStreak: 3,
                    allTimeCorrect: 7,
                    perfectlyDone: 6
                },
                profilePath:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 4,
                name: 'Alice Williams',
                score: {
                    scoreId: 4,
                    dailyStreak: 1,
                    allTimeCorrect: 3,
                    perfectlyDone: 2

                },
                profilePath:'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

            },
            {
                friendID: 5,
                name: 'Charlie Brown',
                score: {
                    scoreId: 5,
                    dailyStreak: 4,
                    allTimeCorrect: 9,
                    perfectlyDone: 7
                },
                profilePath:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
            {
                friendID: 6,
                name: 'Charlie Brown',
                score: {
                    scoreId: 5,
                    dailyStreak: 4,
                    allTimeCorrect: 9,
                    perfectlyDone: 7
                },
                profilePath: null
            }
        ];
        return friends;
    }
}


export const friendService = new FriendService();