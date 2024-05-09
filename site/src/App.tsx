import React from 'react';
import './dist/tailwind.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import AIView from "./Components/AIView";

function App() {
    
  return (
      <Router>
        <Routes>
            <Route path="/" element={<AIView/>}/>
        </Routes>
      </Router>
  );
}

export default App;
