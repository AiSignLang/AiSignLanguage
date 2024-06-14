import React, {useEffect, useState} from 'react';
import Navbar from "../navbar/Navbar.tsx";
import {useLocation} from "react-router-dom";
import {courseService} from "../../services/CourseService.ts";
import {ILevel} from "../../model/ILevel.ts";
import {TaskType} from "../../model/TaskType.ts";
import AIView from "../AIView.tsx";
import {Alert} from "../errors/Alert.tsx";

interface IProps {
    // TODO: Define your props here
}

export function Exercise(props: IProps) {
    console.log("Exerciseprops", props);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');  // replace 'myParam' with the name of your parameter
    const [level, setLevel] = useState<ILevel | null>(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [userInput, setUserInput] = useState<string[]>([]);
    //const navigate = useNavigate(); not used

    const handleNextTask = (skipped: boolean, userSolution: string[] | null) => {
        console.log('userSolution', userSolution);
        if (skipped && level && level.tasks[currentTaskIndex]) {
            level.tasks[currentTaskIndex].skipped = true;
            level.tasks[currentTaskIndex].mistakes = null;
        } else if (level && level.tasks[currentTaskIndex]) {

        }
        setCurrentTaskIndex(prevIndex => prevIndex + 1);
        setUserInput([]);
    };
    const handleUserInput = (input: string) => {
        setUserInput(prevUserInput => [...prevUserInput, input]);
    }
    useEffect(() => {
        switch (type) {
            case 'next': {
                courseService.getNextLevel().then(levelData => setLevel(levelData));
                console.log(level);
                break;
            }
            case null: {
                courseService.getNextLevel().then(levelData => setLevel(levelData));
                console.log("it gets null here");
                break;
            }
        }
    }, [type]);

/*    if (!level || !level.tasks[currentTaskIndex]) {
        console.log("coming in");
        return <Navigate to="/course"/>;

        //return <XnotFound subject="Task" />;
    }*/

    return (
        <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full">
            <Alert title={"Plug-in your device"} image={"/public/img/error/charge.gif"} width={150} height={150} description={"For an enhanced experience, we recommend connecting your device with an outlet."}/>
            <Navbar></Navbar>
            <div className="w-full flex flex-col items-center">
                <div className="bg-bg-secondary rounded-2xl p-4 w-1/3 mt-20" key={level && level.tasks[currentTaskIndex].taskID}>
                    {level && level.tasks[currentTaskIndex] && level.tasks[currentTaskIndex].taskData.map((data, index) => (
                        <React.Fragment key={index}>
                            <span><button className="underline" data-tooltip-target={`tooltip-${index}`}
                                          key={index}>{data}</button> </span>

                            <div id={`tooltip-${index}`} role="tooltip"
                                 className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                Tooltip content
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className="w-1/3 flex justify-between mt-5">
                    {level && level.tasks[currentTaskIndex] && level.tasks[currentTaskIndex].type !== TaskType.RECOGNITION && ( //TODO MAYBE GENERALIZE, COULD BE ISSUE LATER
                        <button onClick={() => {handleNextTask(true,null)}} className="hover:bg-primary-greyed-hover border-2 border-primary-greyed rounded-2xl h-fit w-fit p-4">I
                    can't {level.tasks[currentTaskIndex].type} right now.
                </button>
                )}
                    {/*! TODO Change handleNext user solution param to actual user input*/}
                    {level && level.tasks[currentTaskIndex] && level.tasks[currentTaskIndex].taskData.length === userInput.length ? (
                        <button onClick={() => {
                            handleNextTask(false, level.tasks[currentTaskIndex].taskData)
                        }} className="bg-primary rounded-2xl h-fit w-fit p-4 hover:bg-primary-hover">Next Task →</button>

                    ) : (
                        <button disabled className="bg-btn-bg-disable text-btn-text-disable rounded-2xl h-fit w-fit p-4">Next Task →</button>
                    )}
                </div>

                {level && courseService.isVisualTask(level.tasks[currentTaskIndex].type) && (
                    <div className="mt-8 overflow-hidden rounded-3xl ">
                    <AIView/>
                        <button className="p-4 bg-primary" onClick={() => {
                            handleUserInput('A');
                        }}>P</button>
                    </div>
                )}
            </div>
        </div>
    );
}
