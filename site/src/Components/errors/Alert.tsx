import React, { useState } from 'react';

interface IProps {
    title: string,
    image: string,
    width: number,
    height: number,
    description: string,
}

export function Alert(props: IProps) {
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        setVisible(false);
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="alert bg-bg-secondary rounded-lg p-6 shadow-lg flex flex-col items-center w-80 text-center">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={handleClose}
                >
                    &times;
                </button>
                <h1 className="text-xl font-bold mb-4">{props.title}</h1>
                <img
                    src={props.image}
                    alt={props.title}
                    width={props.width}
                    height={props.height}
                    className="rounded-lg"/>
                <p className="mb-4">{props.description}</p>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={handleClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
}