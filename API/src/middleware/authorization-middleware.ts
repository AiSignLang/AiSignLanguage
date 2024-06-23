import express from 'express';
import {verifyGoogleToken} from "./verify-google";
import {getOAuthUser} from "../services/auth-service";
import {OAuthProvider} from "../routes/auth/model";
import {AuthRequest} from "../model";
import {verifyASLToken} from "./verify-asl";


export async function Authorize(req:  any, res: express.Response, next: express.NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const googleUser = await verifyGoogleToken(token);
        const ownAuthUser = await  verifyASLToken(token)
        let user;
        if (googleUser){
            user = await getOAuthUser(googleUser.sub, OAuthProvider.GOOGLE);
        }
        if (ownAuthUser){
            user = await getOAuthUser(ownAuthUser.id, OAuthProvider.ASL);
        }
        
        if (!googleUser && !ownAuthUser || !user) {
            return res.status(401).send('Unauthorized');
        }
        
        req.user = user!;
        
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
}