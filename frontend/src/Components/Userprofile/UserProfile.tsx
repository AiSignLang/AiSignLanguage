import NavbarProto from "./NavbarProto.tsx";
import User from "./User.tsx";
import Friends from "./Friends.tsx";

export default function UserProfile(){

    return(
        <>
            <div className="bg-blue-950 text-gray-100 grid md:grid-cols-3 gap-2 p-8">
                <div
                    className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-end-2
                    sm:col-start-1 sm:col-span-4 sm:row-start-1 sm:row-end-1"
                >
                    <NavbarProto/>
                </div>

                <div
                    className="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2
                    sm:col-start-4 sm:col-end-6 sm:row-start-1 sm:row-end-1 text-center m-6"
                >
                    <User/>
                </div>

                <div className="md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-2
                    sm:col-start-4 sm:col-end-6 sm:row-start-2 text-center m-6">
                    Component for system message, chatting, log out, etc.
                </div>

                <div
                    className="md:col-start-1 md:col-span-4
                    sm:col-start-3 sm:col-span-3 text-center"
                >
                    <Friends/>
                </div>
            </div>
        </>
    )
}