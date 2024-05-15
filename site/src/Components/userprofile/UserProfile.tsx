import User from "./User.tsx";
import Friends from "./Friends.tsx";
import NavbarProto from "../NavbarProto.tsx";

export default function UserProfile(){

    return(
        <>
            <div className="bg-blue-950 text-gray-100 grid md:grid-cols-3 gap-2 p-8">

                <div className="sm:col-start-1 sm:col-end-4 sm:row-start-1">
                    <NavbarProto/>
                </div>

                <div
                    className="text-center m-6 mt-10
                    md:col-start-1 md:col-end-4 md:row-start-2
                    sm:col-start-1 sm:col-end-4 sm:row-start-2">
                    <User/>
                </div>

                <div className="md:col-start-1 md:col-end-4 md:row-start-3
                    sm:col-start-1 sm:col-end-4 sm:row-start-3 text-center m-6">
                    Component for system message, chatting, log out, etc.
                </div>

                <div
                    className="
                    md:col-start-1 md:col-span-4
                    sm:col-start-1 sm:col-end-4"
                >
                    <Friends/>
                </div>
            </div>
        </>
    )
}