import express from "express";
import {configDotenv} from "dotenv";
import config from "../../config";
import crypto from "crypto";
import {StatusCodes} from "http-status-codes";
import OAuthAccount from "../../data/models/OAuthAccount";
import {OAuthASLTokens, OAuthASLUserData, OAuthProvider} from "./model";
import {registerOAuthUser} from "../../services/auth-service";
import {getUserData} from "./google-auth-router";
import {fetchRestEndpoint} from "../../Utils";

const aslAuthRouter = express.Router();
configDotenv()

aslAuthRouter.post( "/token", async (req, res) => {
    const code = req.body.code as string;
    const email = req.body.email as string;
    if (!code) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const secret = process.env.ASL_SECRET!;
    
//hashing the access code with secret
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(code);
    const hashedAccessCode = hmac.digest('base64');

    
    const tokens = 
        await fetchRestEndpoint<OAuthASLTokens>(
            `${config.externalAddress}/auth/Account/token`, "POST", {
                'accessCode': hashedAccessCode, 
                'email': email,
    }, null);
    const userData =
        await  fetchRestEndpoint<OAuthASLUserData>(`${config.externalAddress}/auth/Account/`,"GET",undefined,tokens?.accessToken)
    const tempUsername = `User${userData?.id}`
    const existingUser = await OAuthAccount.findOne({
        where: {
            oAuthId: userData?.id,
            oAuthProvider: OAuthProvider.ASL
        }
    });
    if (!existingUser) {
        const resi = await registerOAuthUser({
            id:userData!.id,
            name:tempUsername,
            familyName:null,
            givenName:null, 
            picture:null
        }, OAuthProvider.ASL);
        if (resi.status !== StatusCodes.CREATED) {
            res.sendStatus(resi.status);
            return;
        }
    }
    res.status(StatusCodes.OK).json(tokens);
    
});


export default aslAuthRouter;