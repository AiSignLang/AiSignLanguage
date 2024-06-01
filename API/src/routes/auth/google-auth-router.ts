import express from "express";
import {CREATED, StatusCodes} from "http-status-codes";
import {OAuth2Client} from "google-auth-library";
import {configDotenv} from "dotenv";
import {registerOAuthUser} from "../../services/auth-service";
import {OAuthGoogleUserData, OAuthProvider} from "./model";

const googleAuthRouter = express.Router();
configDotenv()

export async function getUserData(access_token: string): Promise<OAuthGoogleUserData> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    console.log('response: ', data);
    return data;
}


googleAuthRouter.get("/", async (req, res) => {
    const code = req.query.code as string;
    try{
        const redirect = "http://localhost:3000/auth/google-auth";
        const client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirect);
        const tokenRes = await client.getToken(code);
        await client.setCredentials(tokenRes.tokens);
        console.log('Token: ', tokenRes.tokens);
        const user =  client.credentials;
        console.log('credentials: ', user);
        if (!user || !user.access_token) 
        {
            res.sendStatus(StatusCodes.BAD_REQUEST);
        }
        
        const userData = await getUserData(user.access_token!)
        
        const regResponse = await registerOAuthUser(null, userData, OAuthProvider.GOOGLE);
        if (regResponse.status !== StatusCodes.CREATED) {
            res.sendStatus(regResponse.status);
            return;
        }
        res.status(StatusCodes.CREATED).json(userData);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

googleAuthRouter.post("/request", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    
    const redirect = "http://localhost:3000/auth/google-auth";
    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirect);
    const authorizeUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: "consent"
    });
    res.json({url: authorizeUrl});
});




export default googleAuthRouter;
