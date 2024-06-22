import React, {useEffect, useState} from "react";
import {replaceValue, validateEmail, validatePassword, ValidationErrors} from "../../../support/Validation.ts";
import aslAuthService from "../../../services/auth/asl-auth-service.ts";

interface IProps {
    changeStep: (step: number)=> void;
}

export default function EmailPassword(prop: IProps) {

    
    const [cachePassword, setCachePassword] = useState('')
    const [cacheEmail, setCacheEmail] = useState('')
    const [passwordErrors, setPasswordErrors] = useState([] as ValidationErrors[]);
    const [emailErrors, setEmailErrors] = useState([] as ValidationErrors[]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        const storedPassword = sessionStorage.getItem("password") || '';
        const storedEmail = sessionStorage.getItem("email") || '';

        setCachePassword(storedPassword);
        setCacheEmail(storedEmail);
        }, []);

    const passwordValidation = (event: React.ChangeEvent<HTMLInputElement> | string) => {
        const typedPassword = typeof event === "string" ? event : event.target.value;

        const possibleErrors: ValidationErrors[] = validatePassword(typedPassword);

        setPasswordErrors(possibleErrors)
        setCachePassword(typedPassword);
        if(possibleErrors.length === 0){
            setPassword(typedPassword);
        }
    }

    const emailClick = async(event: React.ChangeEvent<HTMLInputElement> | string)=>{
        // TODO: some email checks here later, ig , can add them here, but rn just able to enter any email , valid email, can store it in the back end
        
        const typedEmail = typeof event === "string" ? event : event.target.value;
        const possibleErrors: ValidationErrors[] = validateEmail(typedEmail);
        setEmailErrors(possibleErrors);
        setCacheEmail(typedEmail);
        if(possibleErrors.length === 0){
            setEmail(typedEmail);
        }
    }

    const submitCorrect = async (): Promise<boolean> =>{

        if(passwordErrors.length !== 0 || cacheEmail.length === 0 || cachePassword.length === 0){
            return false;
        }
        if(emailErrors.length !== 0){
            return false;
        }
        const check = await aslAuthService.ValidateEmail(cacheEmail);
        setPassword(cachePassword);
        setEmail(cacheEmail);
        if (!check) {
            setEmailErrors([...emailErrors, ValidationErrors.EMAIL_ALREADY_IN_USE])
            return false;
        }

        console.log("password is valid")        // TODO: idk, do something with the values, backend or whatever
        return true; 
    
    }

    return (
        <form className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary">Email address</label>
                <label className="text-xs rounded text-red-500">
                    <ul className="list-disc pl-3">
                        {
                            emailErrors.map((validationError: ValidationErrors) => {
                                return <li key={validationError}>{replaceValue(validationError)} </li>
                            })
                        }
                    </ul>
                </label>
                <input onChange={emailClick} type="email" id="email"
                       value={cacheEmail} className="mt-1 block w-full px-3 py-2 bg-primary-greyed text-text-primary border border-primary-greyed-hover
                       rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"/>
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">Password</label>
                <label className="text-xs rounded text-red-500">
                    <ul className="list-disc pl-3">
                        {
                        passwordErrors.map((validationError:ValidationErrors)=>{
                        return <li key={validationError}>{replaceValue(validationError)} </li>
                        })}
                    </ul>
                </label>
                <input onChange={passwordValidation} type="password" id="password"
                       value={cachePassword} className="mt-1 block w-full px-3 py-2 bg-primary-greyed text-text-primary border border-primary-greyed-hover
                       rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>

            <button onClick={(event) => {
                event.preventDefault();
                emailClick(cacheEmail);
                passwordValidation(cachePassword);
                validateEmail(cacheEmail);
                submitCorrect().then(async (correct) => {
                    if(correct){
                        const resp = await aslAuthService.SignUp(email, password,undefined,(status)=>{
                            console.log(status);
                        });
                        if(resp){
                            prop.changeStep(2);
                        }
                    }
                });
            }} type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary">Sign Up
            </button>
        </form>
    )
}