import User from "./User.tsx";
import Friends from "./Friends.tsx";
import {Recommendations} from "./Recommendations.tsx";

export default function UserProfile(){

    return(
        <>
            <div className="bg-bg-primary text-text-primary p-8 h-full min-h-screen w-full flex p-10">
                <div className="w-2/6 c-lg:w-1/6 c-md:w-0 c-sm:w-0 xs:w-0 ">
                </div>
                <div className="w-3/6 flex c-md:w-4/6 xs:w-full">
                    <div className="w-full">
                        <User username="johndoe"></User>
                        <Friends></Friends>
                    </div>
                </div>
                <div className="w-1/6 xs:w-0">
                    <Recommendations></Recommendations>
                </div>
            </div>
        </>
    )
}