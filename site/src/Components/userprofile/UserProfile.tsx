import User from "./User.tsx";
import Friends from "./Friends.tsx";
import {Recommendations} from "./Recommendations.tsx";
import Navbar from "../navbar/Navbar.tsx";
import {useLocation} from "react-router-dom";
import {NavService} from "../../services/NavigationService.ts";
import {navigate} from "../../model/Utils.ts";
import Joyride, {CallBackProps, STATUS} from "react-joyride"


export default function UserProfile(){
    NavService.changeNavHighlight(useLocation().pathname);
    
    const steps = [
        {
            target: '#streak',
            content: 'This is your streak 🔥. Don\'t break it!',
        },
        {
            target: '#tasksDone',
            content: 'This is the number of tasks you have completed 📚. Ever!',
        },
        {
            target: '#perfectTasks',
            content: 'These are the tasks you did without mistakes 💫. Keep it up!',
        },
        {
            target: '#friends',
            content: 'These are your friends. Healthy competition never hurt anyone 👀.',
        },
        {
            target: '#recommendations',
            content: 'Why not make some more friends? These may be friends of friends or total strangers, you never know...🧐'
        },
    ];
    const handleNextStep = (data: CallBackProps) => {
        const { status } = data;
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED){
            console.log("here")
            localStorage.setItem('profileGuideDone', 'true');
        }
    };

    if (sessionStorage.getItem('id_token') === null
        || sessionStorage.getItem("username") === null) {
        navigate('/login');
        return ;
    }
    return(
        <>
            <Navbar></Navbar>

            <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full flex p-10">

                <div className="w-1/10 xs:w-0 ">

                </div>
                <div className="w-36 c-lg:w-1/6 c-md:w-0 c-sm:w-0 xs:w-0 "/>

                <div className="w-1/2 flex c-md:w-4/6 xs:w-full h-fit mr-10">
                    <div className="w-full bg-bg-secondary rounded-3xl p-10">
                        <User username={sessionStorage.getItem("username")??"John Doe" }/>
                        <span id="friends">
                            <Friends />
                        </span>
                    </div>
                </div>

                <div className="w-1/6 xs:w-0">
                    <span id="recommendations">
                        <Recommendations />
                    </span>
                </div>
            </div>
            {localStorage.getItem('profileGuideDone') === 'true' ? null :  <Joyride
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
            />}
        </>
    )
}
