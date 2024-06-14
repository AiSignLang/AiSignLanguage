import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";

export default function OtherAuth() {
    return (
        <>
            <div
                className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
                <p className="mx-4 mb-0 text-center font-semibold text-text-primary">
                    Or continue with
                </p>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-2">
                <button type="button"
                        className="inline-flex items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <FontAwesomeIcon icon={faGoogle}/>
                    Google
                </button>
                <button type="button"
                        className="inline-flex items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <FontAwesomeIcon icon={faGithub}/>
                    GitHub
                </button>
            </div>
        </>
    )
}