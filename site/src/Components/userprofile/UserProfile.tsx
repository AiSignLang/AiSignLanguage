import User from "./User.tsx";
import Friends from "./Friends.tsx";

export default function UserProfile(){

    return(
        <>
            <div className="bg-bg-primary text-text-primary p-8 h-screen w-screen">
                <User></User>
                <Friends></Friends>
            </div>
        </>
    )
}