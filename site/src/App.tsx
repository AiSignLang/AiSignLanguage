import React from 'react';
import './dist/tailwind.css';
import AIView from "./AIView";

function App() {
  return (
    <div className={"absolute -translate-x-1/2 left-1/2 "}>
      <AIView/>
    </div>
  );
}

export default App;
