import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

export const PORT: number = 8080;
export const EXTERNAL_PORT: number = 8080;

export const DOMAIN: string = "http://localhost";
export let EXTERNAL_DOMAIN: string = "http://localhost";

if (process.env.NODE_ENV === "publish") {
    EXTERNAL_DOMAIN = "http://asl.lambourne.at";
}

export const ADDRESS: string = `${DOMAIN}:${PORT}`;
export const EXTERNAL_ADDRESS: string = `${EXTERNAL_DOMAIN}:${EXTERNAL_PORT}`;

console.log('server running on: ', ADDRESS);
console.log('server running external on: ', EXTERNAL_ADDRESS);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

