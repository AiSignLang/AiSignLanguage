
export enum OAuthProvider{
    GOOGLE = 'google',
    ASL = 'asl'
}

export interface OAuthGoogleUserData{
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

export interface OAuthASLUserData {
    id: string,
    email: string,
}

export interface OAuthASLTokens {
    accessToken: string,
    refreshToken: string
}