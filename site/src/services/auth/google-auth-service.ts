import {navigate} from "../../model/Utils.ts";
import {fetchRestEndpoint} from "../../support/FetchEndpoint.ts";
import OAuthGoogleUserData from "../../model/auth/OAuthGoogleUserData.ts";
import {Credentials} from "google-auth-library";
import config from "../../config.ts";

export async function googleAuth() {
    const  refresh_token = localStorage.getItem('refresh_token');
    if(refresh_token !== null) {
        if (await refreshToken(refresh_token)){
            navigate("/profile")
        }
        return;
    }
    
    const response = await fetch(`${config.externalAddress}/auth/google-auth/request`, {
        method: "POST",
    });
    const data = await response.json();
    navigate(data.url);
}

export async function getUserData(access_token: string): Promise<OAuthGoogleUserData|undefined> {
    return await fetchRestEndpoint<OAuthGoogleUserData>(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`, "GET")
}

export async function refreshToken(refresh_token: string): Promise<boolean> {
    const data = await fetchRestEndpoint<Credentials>(`${config.externalAddress}/auth/google-auth/refresh`, "POST",{refresh_token});
    if (!data || !data.access_token || !data.refresh_token) {
        navigate("/Unauthorized");
        return false;
    }
    sessionStorage.setItem('access_token', data!.access_token!);
    sessionStorage.setItem('id_token', data!.id_token!);
    localStorage.setItem('refresh_token', data!.refresh_token!);
    const userData = await getUserData(data!.access_token!);
    sessionStorage.setItem('username', userData!.name!)
    return true;
}

export async function verifyGoogleAuth(access_token: string): Promise<boolean> {
    const response = await fetch(`${config.externalAddress}/auth/google-auth/verify`, {
        method: "POST",
        body: JSON.stringify({access_token}),
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.ok;
}