import config from "../../config.ts";
import {fetchRestEndpoint} from "../../support/FetchEndpoint.ts";
import {OAuthASLTokens} from "../../model/auth/OAuthASL.ts";
import {StatusCodes} from "http-status-codes";

async function Login(email:string,  password:string,onSuccess?:()=>void,onError?:(response:StatusCodes)=>void):Promise<boolean>{
    const response =  await fetchRestEndpoint<{code:string}>(`${config.externalAddress}/auth/Account/Login`,"POST",{
        'email':email, 
        'password':password
    },false,onError);
    if (!response){
        return false;
    }
    console.log('response', response)
    const tokens = await fetchRestEndpoint<OAuthASLTokens>(`${config.externalAddress}/oauth/asl-auth/token`,"POST",{
        'code':response.code,
        'email':email,
    },false,onError);
    if (!tokens){
        return false;
    }
    sessionStorage.setItem("id_token",tokens.accessToken);
    localStorage.setItem("refresh_token", tokens.refreshToken);
    if (onSuccess)
        onSuccess()
    return true;
}


async  function refreshToken(refresh_token:string,onError?:(response:StatusCodes)=>void):Promise<boolean>{
    const response =  await fetchRestEndpoint<OAuthASLTokens>(`${config.externalAddress}/auth/Account/Refresh`,"POST",
        refresh_token
    ,false,onError);
    if (!response){
        return false;
    }
    sessionStorage.setItem("id_token",response.accessToken);
    localStorage.setItem("refresh_token",response.refreshToken);
    return true;

}

async function VerifyToken(token:string,onSuccess?:()=>void,onError?:(response:StatusCodes)=>void):Promise<boolean>{
    const response =  await fetchRestEndpoint<OAuthASLTokens>(`${config.externalAddress}/auth/Account/verify`,"POST",
        {token},true,onError);
    if (!response){
        return false;
    }
    if (onSuccess)
        onSuccess()
    return true;
}

async function ValidateEmail(email:string,onSuccess?:()=>void,onError?:(response:StatusCodes)=>void):Promise<boolean>{
    try{
        await fetchRestEndpoint(`${config.externalAddress}/auth/Account/validate-email?email=${email}`,"GET",undefined,false,onError);
    }catch (e){
        return false;
    }
    if (onSuccess)
        onSuccess()
    return true;

}

async function SignUp(email:string, password:string, onSuccess?:()=>void,onError?:(response:StatusCodes)=>void):Promise<boolean>{
    const response = await fetchRestEndpoint<{
        code: string
    }>(`${config.externalAddress}/auth/Account/Register`, "POST", {
        'email': email,
        'password': password
    }, false, onError);
    if (!response) {
        return false;
    }
    const tokens = await fetchRestEndpoint<OAuthASLTokens>(`${config.externalAddress}/oauth/asl-auth/token`, "POST", {
        'code': response.code,
        'email': email,
    }, false, onError);
    if (!tokens) {
        return false;
    }
    sessionStorage.setItem("id_token", tokens.accessToken);
    localStorage.setItem("refresh_token", tokens.refreshToken);
    if (onSuccess)
        onSuccess()
    return true;
}
export default {SignUp,Login,VerifyToken,refreshToken, ValidateEmail}