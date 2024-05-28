import React, {useEffect, useState} from 'react';
import Navbar from "../navbar/Navbar.tsx";
import {useLocation} from "react-router-dom";
import {courseService} from "../../services/CourseService.ts";
import {ILevel} from "../../model/ILevel.ts";

interface IProps {
    // TODO: Define your props here
}

export function Exercise(props: IProps) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');  // replace 'myParam' with the name of your parameter
    const [level, setLevel] = useState<ILevel | null>(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const handleNextTask = () => {
        setCurrentTaskIndex(prevIndex => prevIndex + 1);
    };

    useEffect(() => {
        switch (type) {
            case 'next': {
                courseService.getNextLevel().then(levelData => setLevel(levelData));
                break;
            }
            case null: {
                courseService.getNextLevel().then(levelData => setLevel(levelData));
                break;
            }
        }
    }, [type]);

    return (
        <div className="bg-bg-primary text-text-primary h-full min-h-screen w-full">
            <Navbar></Navbar>
            <p>
                {level && level.tasks[currentTaskIndex] ? (
                    <div className="bg-bg-secondary rounded-2xl p-4 w-1/3 mt-20" key={level.tasks[currentTaskIndex].taskID}>
                        {level.tasks[currentTaskIndex].taskData.map((data, index) => (
                            <>
                                <span><span className="underline" data-tooltip-target={`tooltip-${index}`} key={index}>{data}</span> </span>

                                <div id={`tooltip-${index}`} role="tooltip"
                                     className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                    Tooltip content
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </>
                        ))}
                    </div>
                ) : 'No tasks found'}
            </p>
            <button onClick={handleNextTask}>Next Task</button>

        </div>
    );
};