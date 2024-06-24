import {useEffect, useRef, useState} from 'react';
import Navbar from "../navbar/Navbar.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {courseService} from "../../services/CourseService.ts";
import {ILevel} from "../../model/backend/ILevel.ts";
import {Alert} from "../errors/Alert.tsx";
import Joyride, {CallBackProps, STATUS} from "react-joyride";
import CourseRead from "./CourseRead.tsx";
import {Translation} from "./Translation.tsx";

interface IProps {
    // TODO: Define your props here
}

export function Exercise(props: IProps) {
    console.log("Exerciseprops", props);
    const location = useLocation();
    const type = new URLSearchParams(location.search).get('type');
    const nav = useNavigate();

    //States
    const [level, setLevel] = useState<ILevel | null>(null);
    const currentTaskIndex = useRef<number>(0);
    const [rerender,setRerender] = useState<boolean>(false);
    const [showJoyride, setShowJoyride] = useState(false);

    const handleAlertClose = () => {
        setShowJoyride(true);
    };
    const handleNextStep = (data: CallBackProps) => {
        const { status } = data;
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED){
            localStorage.setItem('exerciseGuideCompleted', 'true');
        }
    };
    const handleTaskDone = () => {
        setRerender(!rerender);
        console.log("DOne")
        currentTaskIndex.current += 1;
        if(currentTaskIndex.current === level?.tasks.length){
            courseService.completeLevel(level!.levelId).then(() => {
                console.log("Completed level");
                nav('/course'); //Should redirect
            }).catch(() => {
                console.log("Error completing level");
                nav('/course'); //Should redirect
            });
        }
    }

    useEffect(() => {
        setRerender(!rerender);
        console.log("Caused rerender")
    }, [currentTaskIndex.current]);
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
            target: '#collect',
            content: 'As soon as you\'re ready sign, just click this button and sign until it turns grey.👋📸.',
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
            {level && level.tasks && level.tasks[currentTaskIndex.current] &&
                (Math.round(Math.random()) === 0
                    ? ( <CourseRead task={level?.tasks[currentTaskIndex.current]} taskDone={handleTaskDone}/>)
                    : ( <Translation task={level?.tasks[currentTaskIndex.current]} taskDone={handleTaskDone}/>))}

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
