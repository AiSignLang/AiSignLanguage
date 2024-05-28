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
                {level ? level.tasks.map(task => {
                    return (
                        <div key={task.taskID}>
                            <p></p>
                        </div>
                    );
                }) : 'No tasks found'}
            </p>
        </div>
    );
};