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
        //setPassword(storedPassword);
        console.log(storedPassword);
        setCachePassword(storedPassword);
        //setEmail(storedEmail);// TODO: might be a bug, when I directly set it to the email and password state, but also not? how exactly do I fix this ???
        setCacheEmail(storedEmail);
        }, []);

    useEffect(() => {
        console.log("hm");
        console.log("password got set: " + password);

    }, [password]);

    const passwordValidation = (event: React.ChangeEvent<HTMLInputElement> | string) => {

        console.log("password validation should be the cached password: "+event);
        const typedPassword = typeof event === "string" ? event : event.target.value;
        const possibleErrors: ValidationErrors[] = validatePassword(typedPassword);

        setPasswordErrors(possibleErrors)
        setCachePassword(typedPassword);
        if(possibleErrors.length === 0){
            console.log("password about to be setted: " + typedPassword);
            setPassword(typedPassword); // TODO: state bug: the current password is the same as typed password. typedPassword gets printed out. After that I set it with setPassword. After that I want to print password, but nothing appears. why?
            console.log("password got set: " + password);
        }
    }

    const emailClick = (event: React.ChangeEvent<HTMLInputElement> | string)=>{
        // TODO: some email checks here later, ig , can add them here, but rn just able to enter any email , valid email, can store it in the back end
        const typedEmail = typeof event === "string" ? event : event.target.value;

        setCacheEmail(typedEmail);
        setEmail(typedEmail);
    }
    const submitCorrect = (): boolean =>{
        console.log("email: " + email + " password: " + password);
        console.log("chache email: " + cacheEmail + " cache password: " + cachePassword);

        if(email.length !== 0 && password.length !== 0){
            // TODO: values valid, should not send yet!
            sessionStorage.setItem("email", cacheEmail);
            sessionStorage.setItem("password", cachePassword);
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
                event.preventDefault();
                console.log("on buttom submit plus cachedPass: "+cachePassword);
                console.log("on buttom submit plus cachedEmail: "+cacheEmail);
                emailClick(cacheEmail);
                passwordValidation(cachePassword);
                // TODO: the bug mentioned above, if you come back after all values are correct, and then want to go to step 2 again, it will say that is wrong
                if(submitCorrect()) {
                    event.preventDefault();
                    console.log("values are correct");
                    prop.changeStep(2);
                    return;
                }
                // TODO: state update issue: when I click the submit button, the state gets updated async. But that way, I get an error message, but if I click it again (now it finally loaded) then it works, how can I fix this?
            }} type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary">Sign up
            </button>
        </form>
    )
}