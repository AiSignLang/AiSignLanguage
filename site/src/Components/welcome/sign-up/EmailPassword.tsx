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
        const storedPassword = localStorage.getItem("password") || '';
        const storedEmail = localStorage.getItem("email") || '';
        setPassword(storedPassword);
        setCachePassword(storedPassword);
        setEmail(storedEmail);
        setCacheEmail(storedEmail);
        }, []);

    const passwordValidation = (event: React.ChangeEvent<HTMLInputElement>) => {

        const possibleErrors: ValidationErrors[] = validatePassword(event.target.value);

        setPasswordErrors(possibleErrors)
        setCachePassword(event.target.value);
        if(possibleErrors.length === 0){
            setPassword(event.target.value); // TODO: store it in the backend, more secure
        }
    }

    const emailClick = (event: React.ChangeEvent<HTMLInputElement>)=>{
        // TODO: some email checks here later, ig , can add them here, but rn just able to enter any email , valid email, can store it in the back end
        setCacheEmail(event.target.value);
        setEmail(event.target.value);
    }
    const submitCorrect = (): boolean =>{
        if(email.length !== 0 && password.length !== 0){
            // TODO: values valid, should not send yet!
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            console.log(email + " " + password);
            console.log("password is valid")
            return true;
        }
        console.log("password is not valid")

        return false;
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
                if(submitCorrect()) {
                    event.preventDefault();
                    console.log("values are correct");
                    prop.changeStep(2);
                }
                // TODO: store it in localstorage or in another component
            }} type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary">Sign up
            </button>
        </form>
    )
}