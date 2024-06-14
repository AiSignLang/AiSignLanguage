import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import config from "./config.ts";

import './workers/Statics.ts';

console.log('server running on: ', config.address);
console.log('server running external on: ', config.externalAddress);
console.log('proxy runnting on: ', import.meta.env.VITE_API_BASE_URL);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

