import React, {useEffect, useState} from "react";
import {replaceValue, validatePassword, ValidationErrors} from "../../../support/Validation.ts";

interface IProps {
    changeStep: (step: number)=> void;
}

export default function EmailPassword(prop: IProps) {

    const [password, setPassword] = useState('');
    const [cachePassword, setCachePassword] = useState('')
    const [email, setEmail] = useState('');
    const [cacheEmail, setCacheEmail] = useState('')
    const [passwordErrors, setPasswordErrors] = useState([] as ValidationErrors[]);

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

    const emailClick = (event: React.ChangeEvent<HTMLInputElement> | string)=>{
        // TODO: some email checks here later, ig , can add them here, but rn just able to enter any email , valid email, can store it in the back end
        const typedEmail = typeof event === "string" ? event : event.target.value;

        setCacheEmail(typedEmail);
        setEmail(typedEmail);
    }

    const submitCorrect = (): boolean =>{

        if(passwordErrors.length !== 0 || cacheEmail.length === 0 || cachePassword.length === 0){
            return false;
        }

        sessionStorage.setItem("email", cacheEmail);
        sessionStorage.setItem("password", cachePassword);
        setPassword(cachePassword);
        setEmail(cacheEmail);
        console.log("password is valid")        // TODO: idk, do something with the values, backend or whatever

        return true;
    }

    return (
        <form className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary">Email address</label>
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
                       value={cachePassword} className="mt-1 block w-full px-3 py-2 bg-primary-greyed text-text-primary border
                       border-primary-greyed-hover rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                       focus:ring-primary focus:border-primary sm:text-sm min-h-[50px]" />
            </div>

            <button onClick={(event) => {
                event.preventDefault();
                emailClick(cacheEmail);
                passwordValidation(cachePassword);

                if(submitCorrect()) {
                    console.log("password is valid + email is valid")
                    console.log("email: "+email + " password: "+password);
                    prop.changeStep(2);
                    return;
                }
            }} type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary">Sign up
            </button>
        </form>
    )
}