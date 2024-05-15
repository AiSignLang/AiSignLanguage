import {friendService} from "../../services/FriendService.ts";
import {IFriend} from "../../model/props.ts";

const people = await friendService.getFriends();

// TODO: Service provides data to this constant
export default function Friends() {
    return (

        <ul role="list" className="divide-y divide-gray-500 grid grid-cols-subgrid col-span-8">

            <div className="md:col-start-1 md:col-end-2
                    sm:col-start-1 sm:col-end-3 text-center m-6">
            </div>

            <h1 className="text-2xl font-bold
                  md:col-start-1 md:col-end-3
                  sm:col-start-1 sm:col-end-3 text-center pt-4">Friends</h1>

            <div className="md:col-start-1 md:col-end-3
                    sm:col-start-1 sm:col-end-3 m-6 md:text-left">
                {people.map((friends: IFriend) => (
                    <li key={friends.friendID} className="flex justify-between gap-x-6 py-5 text-gray-300">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                 src={friends.profilePath ? friends.profilePath : undefined} alt=""/> TODO: add alt text + change profile picture to default image
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm leading-6 font-bold">{friends.name}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end text-sm leading-6">
                        <span className="flex items-center text-lg">
                        {friends.score.streak}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" className="bi bi-fire ml-2"
                                viewBox="0 0 16 16">
                                <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
                            </svg>
                        </span>
                        </div>
                    </li>
                ))}

            </div>

        </ul>
    )
}