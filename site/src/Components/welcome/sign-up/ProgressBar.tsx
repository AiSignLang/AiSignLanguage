import {useEffect, useState} from "react";

interface IProps {
    // TODO: Define your props here
    progressStep: number;
    changeStep: (step: number)=> void;

}

const ProgressBar = (prop: IProps) => {

    console.log("progress step in progress bar" + prop.progressStep);

    const [step, setStep] = useState<number>();

    useEffect(() => {
        alert("use effect block: " + prop.progressStep);
        console.log("progress step in the use effect block"+prop.progressStep);
        setStep(prop.progressStep);
    }, []);
    console.log("after user state initialization: " + step);

    console.log("reihenfolge wird eingehalten?")
    console.log("reihenfolge step ist: " + step);
    return (
        <div className="flex items-start justify-center">
            <div className="flex space-x-4 py-4 items-center text-white">
                <div className="flex items-center">
                    <div className={`w-10 h-10 border-2 border-primary text-white flex items-center justify-center rounded-full ${step === 1 ? 'bg-primary' : ''}`}>
                        01
                    </div>
                    <button className="ml-2 text-sm" onClick={()=> prop.changeStep(1)}>paperwork</button>
                </div>

                <div className="w-10 border-t bg-white"></div>

                <div className="flex items-center ">
                    <div className={`w-10 h-10 border-2 border-primary flex items-center justify-center rounded-full ${step === 2 ? 'bg-primary' : ''}`}>
                        02
                    </div>
                    <p className="ml-2" onClick={()=> prop.changeStep(2)}>user</p>
                </div>
                <div className="w-10 border-t bg-white"></div>
                <div className="flex items-center">

                    <div
                        className={`min-w-15 w-10 h-10 border-2 border-primary flex items-center justify-center rounded-full ${step === 3 ? 'bg-primary' : ''}`}>
                        03
                    </div>
                    <button className="ml-2" onClick={() => prop.changeStep(3)}>Preview</button>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;