import React, {useEffect, useRef, useState} from 'react';
import {TaskType} from "../../model/TaskType.ts";
import AIView from "../AIView.tsx";
import { ITask } from '../../model/backend/ITask.ts';

interface IProps {
    task: ITask,
    taskDone: () => void
}

export function Translation(props: IProps) {
    const [wordIndex, setWordIndex] = useState(0);
    const userInput = useRef<string[]>([]);
    const [rerender,setRerender] = useState<boolean>(false);


    useEffect(() => {
        setRerender(!rerender);
    }, [userInput.current]);
    const handleNextTask = (skipped: boolean) => {
        console.log('userSolution', userInput.current);
        if (skipped  && props.task) {
            console.log("SKIPPED") // TODO
        }else if (props.task) {
            // TODO: Add logic here or remove the empty block
        }
        userInput.current = [];
        setWordIndex(0);
        console.log("SWITCHING TASK",userInput)
        props.taskDone();
    };
    const handleCollected = (res: {classes: string[], probabilities: number[]}) => {
        const combined = res.classes.map((str, index) => ({ string: str, probability: res.probabilities[index] }));

        // Sort the combined array based on probabilities in descending orde
        combined.sort((a, b) => b.probability - a.probability);
        const topThree = combined.slice(0, 5);
        const result = topThree.map(item => item.string);
        console.log("RESULTS >>>>>>>>> ", result);

        const word = props.task.tfSolution.split(',')[wordIndex];
        if(word && result.includes(word)){
            handleUserInput(word);
            console.log(word);
            setWordIndex(prevIndex => prevIndex + 1);
        }
    }

    const handleUserInput = (input: string) => {
        userInput.current.push(input);
        console.log("Pushed: ",userInput.current);
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="bg-bg-secondary rounded-2xl p-4 w-1/3 mt-20"
                 key={props.task && props.task.taskId}>
                {props.task && props.task.words && props.task.words.split(',').map((data: string, index: number) => (
                    <React.Fragment key={index}>
                            <span><button className="underline" data-tooltip-target={`tooltip-${index}`}
                                          key={index}>{data}</button> </span>
                    </React.Fragment>
                ))}
            </div>
            <div className="w-1/3 flex justify-between mt-5">
                {props.task && props.task.type !== TaskType.RECOGNITION && ( //TODO MAYBE GENERALIZE, COULD BE ISSUE LATER
                    <button onClick={() => {
                        handleNextTask(true)
                    }}
                            className="cant-spell hover:bg-primary-greyed-hover border-2 border-primary-greyed rounded-2xl h-fit w-fit p-4">I
                        can't {props.task.type} right now.
                    </button>
                )}
                {/*! TODO Change handleNext user solution param to actual user input*/}
                {userInput.current.length === props.task.tfSolution.split(',').length &&
                userInput.current.every((val) => props.task.tfSolution.split(',').includes(val)) ? (
                    <button onClick={() => {
                        handleNextTask(false)
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
            {props.task && (
                <div className="mt-8 overflow-hidden rounded-3xl">
                    <AIView collectionCallback={handleCollected}/>
                </div>
            )}
        </div>
    );
}