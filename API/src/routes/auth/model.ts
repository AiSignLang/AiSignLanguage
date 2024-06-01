
export enum OAuthProvider{
    GOOGLE = 'google'
}

export interface OAuthGoogleUserData{
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}