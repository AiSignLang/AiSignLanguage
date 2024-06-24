import './dist/tailwind.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import './dist/tailwind.css'
import UserProfile from "./Components/userprofile/UserProfile.tsx";
import {XnotFound} from "./Components/errors/XnotFound.tsx";
import {Course} from "./Components/course/Course.tsx";
import {Sandbox} from "./Components/sandbox/Sandbox.tsx";
import {Exercise} from "./Components/exercise/Exercise.tsx";
import TrainingRead from "./Components/training/TrainingRead.tsx";
import TrainingSign from "./Components/training/TrainingSign.tsx";
import LandingPage from "./Components/landingPage/LandingPage.tsx";
import {SignIn} from "./Components/welcome/SignIn.tsx";
import {SignUp} from "./Components/welcome/SignUp.tsx";
import {Unauthorized} from "./Components/errors/Unauthorized.tsx";
import OAuthRedirect from "./Components/auth/OAuthRedirect.tsx";
import {Pause} from "./Components/pause/Pause.tsx";
import Training from './Components/training/Training.tsx';


function App() {
    
  return (
      <Router>
        <Routes>
            {/*   <Route path="/" element={<XnotFound subject={"Profile"} message={"Please try again later."}/>}/> */}
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/pause" element={<Pause/>}/>
            <Route path="/course" element={<Course courseID="next"/>}/>
            <Route path="/sandbox" element={<Sandbox/>}/>
            <Route path="/exercise" element={<Exercise/>}/>
            <Route path="/training" element={<Training/>}/>
            <Route path="/training-read" element={<TrainingRead/>}/>
            <Route path="/training-sign" element={<TrainingSign/>}/>
            <Route path="*" element={<XnotFound subject="Page"/>}/>
            <Route path="/Unauthorized" element={<Unauthorized />}/>
            <Route path="/ProfileNotFound" element={<XnotFound subject="Profile" />}/>
            <Route path="/profile" element={<UserProfile/>}/>
            <Route path="/google-redirect" element={<OAuthRedirect/>}/>
        </Routes>
      </Router>
  );
}

export default App;
