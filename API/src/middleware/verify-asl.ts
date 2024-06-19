
import config from "../config";
import {fetchRestEndpoint} from "../Utils";
import {OAuthASLUserData} from "../routes/auth/model";

export async function verifyASLToken(token: string): Promise<OAuthASLUserData | undefined> {
    try {
        const data = await fetchRestEndpoint<OAuthASLUserData>(`${config.externalAddress}/auth/Account/verify`, "POST", {token:token}, null);
        return data;
    }catch (e){
        return undefined
    }
}