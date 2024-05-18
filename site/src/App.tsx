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
import {Unauthorized} from "./Components/errors/Unauthorized.tsx";

function App() {
    
  return (
      <Router>
        <Routes>
            {/*   <Route path="/" element={<XnotFound subject={"Profile"} message={"Please try again later."}/>}/> */}
            <Route path="/" element={<AIView/>}/>
            <Route path="/ProfileNotFound" element={<XnotFound subject="Profile" />}/>
            <Route path="/profile" element={<UserProfile/>}/>
        </Routes>
      </Router>
  );
}

export default App;
