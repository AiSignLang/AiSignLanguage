import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import config from "./config.ts";

console.log('server running on: ', config.address);
console.log('server running external on: ', config.externalAddress);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

