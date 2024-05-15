import {userService} from "../../services/UserService.ts";

const user = await userService.getUser();

// TODO: Need an UserService
export default function User(){
    return(
        <>
            <div className="grid grid-cols-3">
                {/*
                    profile picture
                */}
                <img
                    className="inline-block h-fit w-fit min-h-[15rem] min-w-[15rem] rounded-full ring-2 ring-white
                    md:col-start-1 md:col-end-4 md:row-start-1
                    xs:col-start-1 xs:col-end-4 xs:row-start-1
                    "
                    src={user.profilePath ? user.profilePath : undefined}
                    alt="user profile picture"
                />
                {/*
                    username/score
                */}
                <div className="inline-block pt-5
                    md:col-start-2 md:row-start-1
                     sm:col-start-1 sm:col-end-4 sm:row-start-2
                    xs:col-start-1 xs:col-end-4 xs:row-start-2
                ">
                    <h1 className="text-4xl p-16 px-15">{user.name}</h1>

                    <div className="flex justify-between">
                        <span className="p-4 text-xl flex items-center">
                            {user.score.streak}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="orange" className="bi bi-fire ml-2"
                            viewBox="0 0 16 16">
                                <path
                            d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
                            </svg>
                        </span>
                        <span className="p-4 text-xl flex items-center">
                            {user.score.allTasks}
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="green"
                                 className="bi bi-check-all ml-2" viewBox="0 0 16 16">
                            <path
                            d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
                            </svg>
                        </span>
                        <span className="p-4 text-xl flex items-center">
                            {user.score.doneWell}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="yellow"
                                 className="bi bi-star-fill ml-2" viewBox="0 0 16 16">
                                <path
                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>
                        </span>
                    </div>

                </div>

                <div className="col-start-3"></div>
            </div>
        </>
    )
}