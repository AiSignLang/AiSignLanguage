import NavbarProto from "./NavbarProto.tsx";
import User from "./User.tsx";
import Friends from "./Friends.tsx";


export default function UserProfile(){
    return(
        <>
            <div className="flex-wrap bg-blue-950 text-gray-100 grid grid-cols-10 grid-rows-2 gap-2">
                <div
                    className="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2
                    xs:col-start-1 xs:col-end-2 xs:row-start-1 xs:row-end-1"
                >
                    <NavbarProto/>
                </div>

                <div
                    className="md:col-start-4 md:col-end-6 md:row-start-1 md:row-end-2
                    xs:col-start-6 xs:col-end-8 xs:row-start-1 xs:row-end-2"
                >
                    <User/>
                </div>

                <div
                    className="md:col-start-4 md:col-end-6 md:row-start-2 md:row-end-2
                    xs:col-start-6 xs:col-end-8 xs:row-start-2 xs:row-end-2"
                >
                    <Friends/>
                </div>
            </div>
        </>
    )
}