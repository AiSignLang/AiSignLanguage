import './dist/tailwind.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import AIView from "./Components/AIView";

import './App.css'
import UserProfile from "./Components/userprofile/UserProfile.tsx";
import {XnotFound} from "./Components/errors/XnotFound.tsx";
import {Course} from "./Components/course/Course.tsx";
import {Sandbox} from "./Components/sandbox/Sandbox.tsx";
import {Exercise} from "./Components/exercise/Exercise.tsx";

function App() {
    
  return (
      <Router>
        <Routes>
            {/*   <Route path="/" element={<XnotFound subject={"Profile"} message={"Please try again later."}/>}/> */}
            <Route path="/" element={<AIView/>}/>
            <Route path="/course" element={<Course/>}/>
            <Route path="/sandbox" element={<Sandbox/>}/>
            <Route path="/exercise" element={<Exercise/>}/>
            <Route path="*" element={<XnotFound subject="Page"/>}/>
            <Route path="/ProfileNotFound" element={<XnotFound subject="Profile" />}/>
            <Route path="/profile" element={<UserProfile/>}/>
        </Routes>
      </Router>
  );
}

export default App;
