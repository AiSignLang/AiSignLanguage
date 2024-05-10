import NavbarProto from "./NavbarProto.tsx";
import User from "./User.tsx";
import Friends from "./Friends.tsx";


export default function UserProfile(){
    return(
        <>
            <div className="bg-blue-950 text-gray-100 grid md:grid-cols-3 gap-2">
                <div
                    className="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2
                    sm:col-start-1 sm:col-end-2 sm:row-start-1 sm:row-end-1 bg-green-600"
                >
                    <NavbarProto/>
                </div>

                <div
                    className="md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-2
                    sm:col-start-4 sm:col-end-6 sm:row-start-1 sm:row-end-1 bg-yellow-950"
                >
                    <User/>
                </div>

                <div
                    className="md:col-start-4 md:col-end-6 md:row-start-2 md:row-end-2
                    sm:col-start-6 sm:col-end-8 sm:row-start-3 sm:row-end-4 bg-red-500"
                >
                    <Friends/>
                </div>
            </div>
        </>
    )
}