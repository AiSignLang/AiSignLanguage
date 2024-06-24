import React, {useEffect, useState} from "react";
import {
    replaceValue, validateUsername,
    ValidationErrors
} from "../../../support/Validation.ts";
import {userService} from "../../../services/UserService.ts";

interface IProps {
    changeStep: (step: number) => void;
}

export default function EnterUsername(prop: IProps){

    const [username, setUsername] = useState('');
    const [cacheUsername, setCacheUsername] = useState('');
    const [usernameErrors, setUsernameErrors] = useState([] as ValidationErrors[]);
    useEffect(() => {
        userService.getMe().then(async (user)=>{
            let storedUsername = user?.userName ?? sessionStorage.getItem("username") ?? '';
            const isGeneratedValid = await validateUsername(user?.userName ?? '')
            if (isGeneratedValid.length !== 0){
                storedUsername = sessionStorage.getItem("username") ?? '';
            }
            console.log(storedUsername);
            setCacheUsername(storedUsername);
            setUsername(storedUsername); // TODO: might be a bug, when  I set it directly to the username
        })
    }, [prop.changeStep]);

    const usernameValidation = (event: React.ChangeEvent<HTMLInputElement>)=>{
        const typedUsername = event !== null ?  event.target.value : cacheUsername;

        // TODO: write route for checking a user exists, bc due to auth it sends error messages and that is not very clean
        (async()=>{
            //const possibleErrors: ValidationErrors[] =  validateUsername(typedUsername);
            const possibleErrors = await validateUsername(typedUsername);
            userService.validateUsername(typedUsername).then((isValid) => {
                if (!isValid && !usernameErrors.includes(ValidationErrors.ALREADY_IN_USE)) {
                    setUsernameErrors([...usernameErrors, ValidationErrors.ALREADY_IN_USE]);
                }
            })
            setUsernameErrors(possibleErrors);
            setCacheUsername(typedUsername);


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
                <button onClick={async() => {
                    usernameValidation(null as unknown as React.ChangeEvent<HTMLInputElement>);
                    const isValid = await userService.validateUsername(username);
                    if (!isValid && !usernameErrors.includes(ValidationErrors.ALREADY_IN_USE)) {
                            setUsernameErrors([...usernameErrors, ValidationErrors.ALREADY_IN_USE]);
                    }
                    if (usernameErrors.length === 0 && isValid){
                        const curUser = await userService.getMe();
                        if (!curUser) {
                            return;
                        }
                        const response = await  userService.patchUser(curUser!.userName, {userName: username});
                        if (!response) {
                            return;
                        }
                        sessionStorage.setItem("username", response!.userName);
                    }
                    prop.changeStep(1);
                }} type="submit"
                        className="w-full justify-center py-2 px-4 rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary
                    inline-flex">go back
                </button>
                <button onClick={async () => {
                    usernameValidation(null as unknown as React.ChangeEvent<HTMLInputElement>);
                    const isValid = await userService.validateUsername(username);
                    if (!isValid && !usernameErrors.includes(ValidationErrors.ALREADY_IN_USE)) {
                        setUsernameErrors([...usernameErrors, ValidationErrors.ALREADY_IN_USE]);
                    }
                    if (usernameErrors.length === 0 && isValid) {
                        const curUser = await userService.getMe();
                        if (!curUser) {
                            return;
                        }
                        const response = await userService.patchUser(curUser!.userName, {userName: username});
                        if (!response) {
                            return;
                        }
                        console.log("user saved");
                        sessionStorage.setItem("username", response!.userName);
                        prop.changeStep(3);
                    }
                    
                }} type="submit"
                        className="w-full justify-center py-2 px-4 rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-flex">finish up!
                </button>
            </div>
        </div>
    )
}