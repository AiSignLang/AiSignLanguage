import {Link} from "react-router-dom";

function Subnav(){
    return (
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 relative flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link to="/login"
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white">
                    Login
                </Link>
            </div>
        </div>
    )
}

export default Subnav;