import {OAuth2Client, TokenPayload} from "google-auth-library";
import config from "../config";



const redirect = `${config.externalDomain}/oauth-google-redirect`;
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirect);

export async function verifyGoogleToken(token: string): Promise<TokenPayload | undefined> {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}