import './dist/tailwind.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import './App.css'
import UserProfile from "./Components/userprofile/UserProfile.tsx";
import {XnotFound} from "./Components/errors/XnotFound.tsx";
import {Course} from "./Components/course/Course.tsx";
import {Sandbox} from "./Components/sandbox/Sandbox.tsx";
import {Exercise} from "./Components/exercise/Exercise.tsx";
import TrainingRead from "./Components/training/TrainingRead.tsx";
import TrainingSign from "./Components/training/TrainingSign.tsx";
import LandingPage from "./Components/landingPage/LandingPage.tsx";
function App() {
    
  return (
      <Router>
        <Routes>
            {/*   <Route path="/" element={<XnotFound subject={"Profile"} message={"Please try again later."}/>}/> */}
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/course" element={<Course courseID="next"/>}/>
            <Route path="/sandbox" element={<Sandbox/>}/>
            <Route path="/exercise" element={<Exercise/>}/>
            <Route path="/training-read" element={<TrainingRead/>}/>
            <Route path="/training-sign" element={<TrainingSign/>}/>
            <Route path="*" element={<XnotFound subject="Page"/>}/>
            <Route path="/ProfileNotFound" element={<XnotFound subject="Profile" />}/>
            <Route path="/profile" element={<UserProfile/>}/>
            <Route path="/login" element={<LoginForm/>}/>
        </Routes>
      </Router>
  );
}

export default App;
