import User from "./User.tsx";
import Friends from "./Friends.tsx";
import {Recommendations} from "./Recommendations.tsx";
import Navbar from "../navbar/Navbar.tsx";
import {useLocation} from "react-router-dom";
import {NavService} from "../../services/NavigationService.ts";
import {useEffect} from "react";
import {navigate} from "../../model/Utils.ts";

export default function UserProfile(){
    NavService.changeNavHighlight(useLocation().pathname);
   
    useEffect(() => {
        if (sessionStorage.getItem('access_token') === null 
            || sessionStorage.getItem("username") === null) navigate('/login');
        
    }, []);
    return(
        <>
            <Navbar></Navbar>

            <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full flex p-10">
                <div className="w-2/6 c-lg:w-1/6 c-md:w-0 c-sm:w-0 xs:w-0 ">

                </div>

                <div className="w-3/6 flex c-md:w-4/6 xs:w-full h-fit mr-10">
                    <div className="w-full bg-bg-secondary rounded-3xl p-10">
                        <User username={sessionStorage.getItem("username")}/>
                        <Friends/>
                    </div>
                </div>

                <div className="w-1/6 xs:w-0">
                    <Recommendations/>
                </div>
            </div>
        </>
    )
}