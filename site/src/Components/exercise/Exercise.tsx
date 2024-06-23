import React, {useEffect, useState} from 'react';
import Navbar from "../navbar/Navbar.tsx";
import {useLocation} from "react-router-dom";
import {courseService} from "../../services/CourseService.ts";
import {ILevel} from "../../model/backend/ILevel.ts";
import {TaskType} from "../../model/TaskType.ts";
import AIView from "../AIView.tsx";
import {Alert} from "../errors/Alert.tsx";
import Joyride, {CallBackProps, STATUS} from "react-joyride";

interface IProps {
    // TODO: Define your props here
}

export function Exercise(props: IProps) {
    console.log("Exerciseprops", props);
    const location = useLocation();
    const type = new URLSearchParams(location.search).get('type');

    //States
    const [level, setLevel] = useState<ILevel | null>(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [userInput, setUserInput] = useState<string[]>([]);
    const [showJoyride, setShowJoyride] = useState(false);

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
    const handleAlertClose = () => {
        setShowJoyride(true);
    };
    const handleCollected = (res: {classes: string[], probabilities: number[]}) => {
        console.log("DATA HAS BEEN COLLECTED");
    }
    const handleNextStep = (data: CallBackProps) => {
        const { status } = data;
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED){
            localStorage.setItem('exerciseGuideCompleted', 'true');
        }
    };
    useEffect(() => {

        console.log("use effect type")
        switch (type) {
            case 'next': {
                console.log("YOGHURT 2");
                courseService.getNextLevel().then(levelData => {
                    console.log("levelData", levelData);
                    if(levelData){
                        setLevel(levelData)
                    }else{
                        //! TODO: Redirect to course page
                    }
                });
                console.log(level);
                break;
            }
            case null: {
                courseService.getNextLevel().then(levelData => {
                    if(levelData){
                        setLevel(levelData)
                    }else{
                        //! TODO: Redirect to course page
                    }
                });
                console.log("it gets null here");
                break;
            }
            default: {
                courseService.getNextLevel().then(levelData => {
                    if(levelData){
                        setLevel(levelData)
                    }else{
                        //! TODO: Redirect to course page
                    }});
            }
        }
    }, [type]);

/*    if (!level || !level.tasks[currentTaskIndex]) {
        console.log("coming in");
        return <Navigate to="/course"/>;

        //return <XnotFound subject="Task" />;
    }*/

    const steps = [
        {
            target: '.cant-spell',
            content: 'In case you cannot spell the word, you can skip the task.',
        },
        {
            target: '.collect',
            content: 'For each underlined word, click this button. After a countdown, sign the word. 👋📸.',
        },
        {
            target: '.next-task',
            content: "This will only unlock 🔓 when you've signed all the words or made too many mistakes ❌."
        },
        ];

    return (
        <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full">
            <Alert
                title={"Plug-in your device"}
                image={"/public/img/error/charge.gif"}
                width={150}
                height={150}
                description={"For an enhanced experience, we recommend connecting your device with an outlet."}
                onClose={handleAlertClose}
            />
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
                        <button onClick={() => {handleNextTask(true,null)}} className="cant-spell hover:bg-primary-greyed-hover border-2 border-primary-greyed rounded-2xl h-fit w-fit p-4">I
                    can't {level.tasks[currentTaskIndex].type} right now.
                </button>
                )}
                    {/*! TODO Change handleNext user solution param to actual user input*/}
                    {level && level.tasks[currentTaskIndex] && level.tasks[currentTaskIndex].taskData.length === userInput.length ? (
                        <button onClick={() => {
                            handleNextTask(false, level.tasks[currentTaskIndex].taskData)
                        }} className="bg-primary rounded-2xl h-fit w-fit p-4 hover:bg-primary-hover">Next Task →</button>
                    ) : (
                        <div>
                            <button disabled
                                    className="next-task ml-5 bg-btn-bg-disable text-btn-text-disable rounded-2xl h-fit w-fit p-4">Next
                                Task →
                            </button>
                        </div>
                    )}
                </div>

                {level && courseService.isVisualTask(level.tasks[currentTaskIndex].type) && (
                    <div className="mt-8 overflow-hidden rounded-3xl">
                        <AIView collectionCallback={handleCollected}/>
                        <button className="p-4 bg-primary" onClick={() => {
                            handleUserInput('A');
                        }}>P</button>
                    </div>
                )}
            </div>
            {showJoyride && localStorage.getItem('exerciseGuideCompleted') !== 'true' && (
                <Joyride
                    steps={steps}
                    continuous
                    showSkipButton
                    spotlightClicks={false}
                    disableOverlayClose={true}
                    showProgress
                    locale={{
                        back: 'Back',
                        close: 'Close',
                        last: 'Finish',
                        next: 'Next',
                        skip: 'Close and don\'t show this again',
                    }}
                    callback={handleNextStep}
                    styles={{
                        options: {
                            zIndex: 10000,
                            textColor: '#fff',
                            backgroundColor: '#374151',
                            primaryColor: '#d81d3f',
                            arrowColor: '#374151',
                            beaconSize: 50,
                        },
                    }}
                />
            )}
        </div>
    );
}
