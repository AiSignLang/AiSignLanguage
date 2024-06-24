import {useState} from "react";
import {IMistake} from "../../../model/backend/IMistake.ts";
interface IProp{
    mistake: IMistake
}


export default function ToolTip(prop: IProp) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                className="bg-primary text-white font-semibold py-0 px-2 rounded-3xl"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >   ?
            </button>
            {isVisible && (
                <div
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => setIsVisible(false)}

                    className="absolute left-0 top-0 mt-2 w-fit bg-bg-primary rounded-md overflow-hidden shadow-bg-primary shadow-lg z-10">
                    <div className="px-8 py-2 text-white text-sm">{prop.mistake.solution}</div>
                </div>
            )}
        </div>
    )
}