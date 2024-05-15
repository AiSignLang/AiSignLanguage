import React from 'react';

interface IProps {
    // TODO: Define your props here
}

export function Unauthorized(props: IProps) {
    return (
        <div className="h-screen flex flex-col sm:flex-row bg-blue-950 text-gray-100 p-8">
            <div className="w-full sm:w-1/2 flex items-center justify-center text-white">
                <div>
                    <h1 className="text-6xl font-bold">401</h1>
                    <p className="text-xl">Unauthorized</p>
                    <p className="text-md">You are not authorized to use this page!</p>
                    <a href="/" className="mt-4 inline-block text-white py-2 hover:text-blue-400">
                        ← Go back home
                    </a>
                </div>
            </div>
            <div className="w-full sm:w-1/2 flex items-center justify-center">
                <img src="../../../public/img/error/401.svg" alt="401 error image"
                     className="object-cover h-full w-full "/>
            </div>
        </div>
    );
};