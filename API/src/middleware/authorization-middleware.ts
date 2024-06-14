import express from 'express';
import {verifyGoogleToken} from "./verify-google";
import {getOAuthUser} from "../services/auth-service";
import {OAuthProvider} from "../routes/auth/model";
import {AuthRequest} from "../model";


export async function Authorize(req:  any, res: express.Response, next: express.NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const googleUser = await verifyGoogleToken(token);
        const ownAuthUser = undefined //TODO the user from our auth service (not implemented)
        let user;
        if (googleUser){
            user = await getOAuthUser(googleUser.sub, OAuthProvider.GOOGLE);
        }
        
        if (!googleUser && !ownAuthUser && !user) {
            return res.status(401).send('Unauthorized');
        }
        
        req.user = user!;
        
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
}