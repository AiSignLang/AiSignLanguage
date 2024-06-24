
interface IProps {
    // TODO: Define your props here
    progressStep: number;
    changeStep: (step: number)=> void;
    
}

const ProgressBar = (prop: IProps) => {
    const isLoggedIn = () =>{
        return !!sessionStorage.getItem("id_token");
    }
    return (
        <div className="flex items-start justify-center max-w-fit">
            <div className="flex space-x-4 py-4 items-center text-white">
                <div className="flex items-center">
                    <button onClick={()=> prop.changeStep(1)} className={`w-10 h-10 border-2 border-primary text-white flex items-center justify-center rounded-full ${prop.progressStep === 1 ? 'bg-primary' : ''}`}>
                        01
                    </button>
                    <p className="ml-2 text-sm">credentials</p>
                </div>

                <div className="md:w-0 w-6 border-t bg-white"/>

                <div className="flex items-center ">
                    <button onClick={()=>isLoggedIn() && prop.changeStep(2)} className={`w-10 h-10 border-2 border-primary flex items-center justify-center rounded-full ${prop.progressStep === 2 ? 'bg-primary' : ''}`}>
                        02
                    </button>
                    <p className="ml-2">name</p>
                </div>
                <div className="md:w-0 w-6 border-t bg-white"/>
                <div className="flex items-center">

                    <button onClick={() =>isLoggedIn() && prop.changeStep(3)}
                        className={`min-w-15 w-10 h-10 border-2 border-primary flex items-center justify-center rounded-full ${prop.progressStep === 3 ? 'bg-primary' : ''}`}>
                        03
                    </button>
                    <p className="ml-2">picture</p>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;