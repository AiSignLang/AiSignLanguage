import User from "./User.tsx";
import Friends from "./Friends.tsx";
import {Recommendations} from "./Recommendations.tsx";
import Navbar from "../navbar/Navbar.tsx";

export default function UserProfile(){

    return(
        <>
            <div>
                <Navbar></Navbar>
                <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full flex p-10">

                <div className="w-2/6 c-lg:w-1/6 c-md:w-0 c-sm:w-0 xs:w-0 ">
                </div>
                <div className="w-3/6 flex c-md:w-4/6 xs:w-full h-fit mr-10">
                    <div className="w-full bg-bg-secondary rounded-3xl p-10">
                        <User username="johndoe"></User>
                        <Friends></Friends>
                    </div>
                </div>
                <div className="w-1/6 xs:w-0">
                    <Recommendations></Recommendations>
                </div>
            </div>
            </div>
        </>
    )
}