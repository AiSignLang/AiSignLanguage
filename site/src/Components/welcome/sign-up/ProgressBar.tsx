
interface IProps {
    // TODO: Define your props here
    progressStep: number;
    changeStep: (step: number)=> void;

}

const ProgressBar = (prop: IProps) => {

    return (
        <div className="flex items-start justify-center">
            <div className="flex space-x-4 py-4 items-center text-white">
                <div className="flex items-center">
                    <div className={`w-10 h-10 border-2 border-primary text-white flex items-center justify-center rounded-full ${prop.progressStep === 1 ? 'bg-primary' : ''}`}>
                        01
                    </div>
                    <button className="ml-2 text-sm" onClick={()=> prop.changeStep(1)}>paperwork</button>
                </div>

                <div className="w-10 border-t bg-white"></div>

                <div className="flex items-center ">
                    <div className={`w-10 h-10 border-2 border-primary flex items-center justify-center rounded-full ${prop.progressStep === 2 ? 'bg-primary' : ''}`}>
                        02
                    </div>
                    <p className="ml-2" onClick={()=> prop.changeStep(2)}>user</p>
                </div>
                <div className="w-10 border-t bg-white"></div>
                <div className="flex items-center">

                    <div
                        className={`min-w-15 w-10 h-10 border-2 border-primary flex items-center justify-center rounded-full ${prop.progressStep === 3 ? 'bg-primary' : ''}`}>
                        03
                    </div>
                    <button className="ml-2" onClick={() => prop.changeStep(3)}>Preview</button>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;