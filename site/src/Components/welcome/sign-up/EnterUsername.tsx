import React, {useEffect, useState} from "react";
import {
    replaceValue, validateUsername,
    ValidationErrors
} from "../../../support/Validation.ts";

interface IProps {
    changeStep: (step: number) => void;
}


export default function EnterUsername(prop: IProps){

    const [username, setUsername] = useState('');
    const [cacheUsername, setCacheUsername] = useState('');
    const [usernameErrors, setUsernameErrors] = useState([] as ValidationErrors[]);
    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username") || '';
        console.log(storedUsername);
        setCacheUsername(storedUsername);
        setUsername(storedUsername); // TODO: might be a bug, when  I set it directly to the username
    }, []);

    const usernameValidation = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const typedUsername = event !== null ?  event.target.value : cacheUsername;

        // TODO: write route for checking a user exists, bc due to auth it sends error messages and that is not very clean
        (async()=>{
            //const possibleErrors: ValidationErrors[] =  validateUsername(typedUsername);
            const possibleErrors = await validateUsername(typedUsername);
            setUsernameErrors(possibleErrors);
            setCacheUsername(typedUsername);

            sessionStorage.setItem("username", typedUsername);

            if(possibleErrors.length === 0){
                console.log("username in validation block: "+typedUsername);
                setUsername(typedUsername);
            }
        })();
    }

    return (
        <div className="text-white space-y-6">
            <label htmlFor="first-name" className="block text-sm font-medium leading-6">
                Username:
            </label>

            <label className="text-xs rounded text-red-500">
                <ul className="list-disc pl-3">
                    {
                        usernameErrors.map((validationError: ValidationErrors) => {
                            return <li key={validationError}>{replaceValue(validationError)} </li>
                        })}
                </ul>
            </label>

            <div className="mt-2">
                <input
                    value={cacheUsername}
                    onChange={usernameValidation}
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    maxLength={20}
                    className="mt-1 block w-full px-3 py-2 bg-primary-greyed text-text-primary border border-primary-greyed-hover
                       rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>


            <div className="flex justify-between rounded mt-5 space-x-4">
                <button onClick={() => {
                    prop.changeStep(2);
                }} type="submit"
                        className="w-full justify-center py-2 px-4 rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary
                    inline-flex">go back
                </button>
                <button onClick={() => {
                    usernameValidation(null as unknown as React.ChangeEvent<HTMLInputElement>);

                    alert("can navigate to the next page")
                    console.log("login done")

                }} type="submit"
                        className="w-full justify-center py-2 px-4 rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-flex">finish up!
                </button>
            </div>
        </div>
    )
}