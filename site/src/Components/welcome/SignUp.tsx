import ProgressBar from "./sign-up/ProgressBar.tsx";
import EmailPassword from "./sign-up/EmailPassword.tsx";
import OtherAuth from "./sign-up/OtherAuth.tsx";
import {useEffect, useState} from "react";

interface IProps {
    // TODO: Define your props here
}

export function SignUp(props: IProps) {
    console.log("SignUp props", props);

    const [progressStep, setProgressStep] = useState<number>(1);

    const changeStep = (step: number)=>{
        console.log("this method got called from the child component")
        setProgressStep(step);

        console.log("Progress step got updated: " + step);


    }
    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
            <div className="min-h-80 bg-bg-secondary p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Sign up to your account</h2>


                <ProgressBar progressStep={progressStep} changeStep={changeStep} />
                {progressStep === 1 && <>
                    <EmailPassword changeStep={changeStep}/>
                    <OtherAuth/>
                </>}

            </div>

        </div>
    );
}

export default SignUp;