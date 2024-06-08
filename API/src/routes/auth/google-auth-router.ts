import express from "express";
import { StatusCodes} from "http-status-codes";
import {OAuth2Client} from "google-auth-library";
import {configDotenv} from "dotenv";
import {registerOAuthUser} from "../../services/auth-service";
import {OAuthGoogleUserData, OAuthProvider} from "./model";
import OAuthAccount from "../../data/models/OAuthAccount";
import config from "../../config";

const googleAuthRouter = express.Router();
configDotenv()

const redirect = `${config.externalAddress}/oauth-google-redirect`;
console.log('redirect: ', redirect);
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirect);

export async function getUserData(access_token: string): Promise<OAuthGoogleUserData> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    console.log('response: ', data);
    return data;
}

const dataScope = 'https://www.googleapis.com/auth/userinfo.profile openid';

googleAuthRouter.get( "/verify", async (req, res) => {
    const token = req.body.access_token;
    if (!token) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
try {
        await client.setCredentials(
        {
            access_token: token,
            scope: dataScope
        });
        const user = client.credentials;
        if (!user || !user.access_token) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
        }
        const userData = await getUserData(user.access_token!);
        if (!userData) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
        }
        res.sendStatus(StatusCodes.OK);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
});

googleAuthRouter.get( "/token", async (req, res) => {
    
    const code = req.query.code as string;
    if (!code) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    try {
        const tokenRes = await client.getToken(code);
        await client.setCredentials(tokenRes.tokens);
        console.log('Token: ', tokenRes.tokens);
        const user = client.credentials;
        console.log('credentials: ', user);
        if (!user || !user.access_token) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
        }
        const userData = await getUserData(user.access_token!);
        const existingUser = await OAuthAccount.findOne({
            where: {
                oAuthId: userData.sub,
                oAuthProvider: OAuthProvider.GOOGLE
            }
        });
        if (!existingUser) {
            const resi = await registerOAuthUser(userData, OAuthProvider.GOOGLE);
            if (resi.status !== StatusCodes.CREATED) {
                res.sendStatus(resi.status);
                return;
            }
        }
        res.status(StatusCodes.OK).json(user);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

googleAuthRouter.post("/refresh", async (req, res) => {
    const refresh = req.body.refresh_token;
    if (!refresh) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    try {
        await client.setCredentials(
        {
            refresh_token: refresh,
            scope: dataScope
        });
        const tokenRes = await client.refreshAccessToken();
        await client.setCredentials(tokenRes.credentials);
        res.status(StatusCodes.OK).json(tokenRes.credentials);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

googleAuthRouter.post("/request", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    
    const authorizeUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: dataScope,
        prompt: "consent"
    });
    res.json({url: authorizeUrl});
});




export default googleAuthRouter;
