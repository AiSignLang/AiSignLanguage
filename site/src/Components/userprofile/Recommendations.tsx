import React from 'react';
import {IFriend} from "../../model/props.ts";
import {friendService} from "../../services/FriendService.ts";

interface IProps {
    // TODO: Define your props here
}

const sug = await friendService.getSuggestions();

export function Recommendations(props: IProps) {
    return (
        <div className="flex flex-col border-1 w-full">
            <h1>Friend suggestions</h1>
            <ul>
                {sug.map((friends: IFriend) => (
                    <li key={friends.friendID}
                        className="flex content-center justify-between gap-x-6 py-5 text-gray-300">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                 src={friends.profilePath ? friends.profilePath : undefined}
                                 alt=""/> {/*TODO: add alt text + change profile picture to default image*/}
                            <div className="min-w-0 flex-auto">
                                <p className="text-xl leading-6 font-bold">{friends.name}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end text-sm leading-6">
                            <span className="flex items-center text-lg">
                                <span className="flex items-center mr-7 c-md:mr-2 c-sm:mr-2">
                                    {friends.score.streak}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange"
                                         className="bi bi-fire ml-1"
                                         viewBox="0 0 16 16">
                                    <path
                                        d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
                                </svg>
                              </span>
                                <span className="flex items-center mr-7 c-md:mr-2 c-sm:mr-2">
                                    10
                                 <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="green"
                                      className="bi bi-check-all" viewBox="0 0 16 16">
                                    <path
                                        d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
                                    </svg>
                                </span>
                               <span className="flex items-center">
                                    20
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="yellow"
                                      className="bi bi-star-fill ml-1" viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                               </span>
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};