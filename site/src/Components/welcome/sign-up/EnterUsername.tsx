import React, {useEffect, useState} from "react";
import {
    replaceValue, validateUsername,
    ValidationErrors
} from "../../../support/Validation.ts";




export default function EnterUsername(){

    const [username, setUsername] = useState('');
    const [cacheUsername, setCacheUsername] = useState('');
    const [usernameErrors, setUsernameErrors] = useState([] as ValidationErrors[]);
    useEffect(() => {
        const storedUsername = localStorage.getItem("username") || '';
        setCacheUsername(storedUsername);
        setUsername(storedUsername);
    }, []);

    const usernameValidation = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const typedUsername = event !== null ?  event.target.value : cacheUsername;

        // TODO: write route for checking a user exists, bc due to auth it sends error messages and that is not very clean
        (async()=>{
            //const possibleErrors: ValidationErrors[] =  validateUsername(typedUsername);
            const possibleErrors = await validateUsername(typedUsername);
            setUsernameErrors(possibleErrors);
            setCacheUsername(typedUsername);

            if(possibleErrors.length === 0){
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>

            <button onClick={() => {
                usernameValidation(null as unknown as React.ChangeEvent<HTMLInputElement>);

                // TODO: store it in localstorage or in another component
            }} type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Finish up!
            </button>
        </div>
    )
}