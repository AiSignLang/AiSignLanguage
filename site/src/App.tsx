import './dist/tailwind.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import AIView from "./Components/AIView";

import './App.css'
import UserProfile from "./Components/userprofile/UserProfile.tsx";

function App() {
    
  return (
      <Router>
        <Routes>
            <Route path="/" element={<AIView/>}/>
            <Route path="/profile" element={<UserProfile/>}/>
        </Routes>
      </Router>
  );
}

export default App;
