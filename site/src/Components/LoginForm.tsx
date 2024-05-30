import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
const LoginForm:React.FC = ()=> {
    
    function navigate(url:string){
        window.location.href = url;
    }
    
    async function googleAuth(){
        const response = await fetch("http://localhost:3000/auth/google-auth/request",{
            method: "POST",
        });
        const data = await response.json();
        navigate(data.url);
    }
    
    return(
        <>
            <h1>Login</h1>
            <h3>Sign in with Google</h3>
            <button  className={"btn btn-blue w-8 h-8"} onClick={()=>googleAuth()} type={"button"}>
                <FontAwesomeIcon icon={faGoogle}/>
            </button>
            
        </>
    )
}
export default LoginForm;