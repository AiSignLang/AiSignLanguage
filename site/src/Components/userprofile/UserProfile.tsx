import User from "./User.tsx";
import Friends from "./Friends.tsx";

export default function UserProfile(){

    return(
        <>
            <div className="bg-blue-950 text-gray-100 p-8">
                <User></User>
                <Friends></Friends>
            </div>
        </>
    )
}