import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {googleAuth} from "../../services/auth/google-auth-service.ts";
import aslAuthService from "../../services/auth/asl-auth-service.ts";
import  {useState} from "react";
import {useNavigate} from "react-router-dom";



export function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    
    
    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
            <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Sign in to your account</h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary">Email address</label>
                        <input onChange={(event) => {
                            const typedEmail = event.target.value;
                            setError(false);
                            setEmail(typedEmail);
                        }} value={email} type="email" id="email" className="mt-1 block w-full px-3 py-2 bg-primary-greyed text-text-primary border border-primary-greyed-hover rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-primary">Password</label>
                        <input onChange={(event)=>{
                            const typedPassword = event.target.value;
                            setError(false);
                            setPassword(typedPassword);
                        }} value={password} type="password" id="password" className="mt-1 block w-full px-3 py-2 bg-primary-greyed text-text-primary border border-primary-greyed-hover rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-primary-greyed-hover rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-primary">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary hover:text-primary-hover">Forgot your password?</a>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs pb-1 text-center text-red-500">
                            <ul className="list-disc">
                                {
                                    error && <span>Invalid email or password</span>
                                }
                            </ul>
                        </label>
                        <button type="submit" 
                                onClick={(event)=>{
                                    event.preventDefault();
                                    aslAuthService.Login(email, password, ()=>{
                                        navigate('/profile');
                                    },()=>{
                                        setError(true);
                                    })
                                }}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Sign in</button>
                    </div>
                    <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
                        <p className="mx-4 mb-0 text-center font-semibold text-text-primary">
                            Or continue with
                        </p>
                    </div>
                    <div className="mt-6 flex items-center justify-center space-x-2">
                        <button type="button" 
                                onClick={()=>googleAuth()}
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
                </form>
                <p className="mt-6 text-center text-sm text-text-primary">
                    Not a member? <a href="/signup" className="font-medium text-primary hover:text-primary-hover">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
export default SignIn;