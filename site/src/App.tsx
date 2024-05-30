import './dist/tailwind.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import AIView from "./Components/AIView";
import LoginForm from "./Components/LoginForm.tsx";

function App() {
    
  return (
      <Router>
        <Routes>
            <Route path="/" element={<AIView/>}/>
            <Route path="/login" element={<LoginForm/>}/>
        </Routes>
      </Router>
  );
}

export default App;
