import {OAuth2Client} from "google-auth-library";

async function getAccessTokenWithRefresh(client: OAuth2Client): Promise<string | null> {
    const now = (new Date()).getTime();
    const isTokenExpired = client.credentials.expiry_date ? now >= client.credentials.expiry_date : false
    
    if (client.credentials.access_token && !isTokenExpired) {
        return client.credentials.access_token;
    } else if (client.credentials.refresh_token) {
        const newToken = await client.refreshAccessToken();
        client.setCredentials(newToken.credentials);
        return newToken.credentials.access_token || null;
    } else {
        return null;
    }
}