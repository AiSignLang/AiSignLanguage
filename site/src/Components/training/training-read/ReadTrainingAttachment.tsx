import React, {useState} from "react";
import {IMistake} from "../../../model/backend/IMistake.ts";

interface IProp{
    mistake: IMistake
    changeVideo: () => void
}

export default function ReadTrainingAttachment(prop: IProp){
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState('')
    const changeInput = (event: React.ChangeEvent<HTMLInputElement> | string) => {
        const typedInput = typeof event === "string" ? event : event.target.value;

        setUserInput(typedInput)
    }

    return (
        <div className="text-gray-300 space-y-6 w-1/3">
            <label htmlFor="submit" className="block text-sm font-medium leading-6">
                Enter your solution:
            </label>

            <label htmlFor="error" className="text-red-500">
                {error === '' ? '' : error}
            </label>
            <div className="mt-2">
                <input
                    onChange={changeInput}
                    type="text"
                    name="user-input"
                    id="submit"
                    placeholder="z.b hallo oder wie geht es dir?"
                    className="w-full mt-1 block px-3 py-2 bg-primary-greyed text-text-primary border border-primary-greyed-hover
                       rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            </div>

            <div className="rounded mt-5 space-x-4">
                <button onClick={async () => {

                    if (userInput.toLowerCase() === prop.mistake.solution.toLowerCase()) {
                        setError('');
                        console.log("hiya")
                        prop.changeVideo();
                        // todo: click on, to the next mistake
                    } else {
                        setError('Not correct, try again');
                    }

                }} type="submit"
                        className="w-full justify-center py-2 px-4 rounded-md shadow-sm
                    text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-flex">Control
                </button>
            </div>
        </div>

    )
}