import {OAuthGoogleUserData, OAuthProvider} from "../routes/auth/model";
import OAuthAccount from "../data/models/OAuthAccount";
import User from "../data/models/User";
import sequelize from "../data/database";
import {createUser} from "./user-service";
import {StatusCodes} from "http-status-codes";
import {ServiceReturn} from "../model";

export async function registerOAuthUser(dbUser:User | null, oauthUser: OAuthGoogleUserData,  provider: OAuthProvider) : Promise<ServiceReturn<OAuthAccount>>
{
    let id: string;
    let name: string;
    // switch for different providers
    switch (provider) {
        case OAuthProvider.GOOGLE:
            id = oauthUser.sub;
            name = oauthUser.name;
            break;
    }
    
    const existingUser = await OAuthAccount.findOne({
        where: {
            oAuthId: id,
            oAuthProvider: provider
        }
    });
    if (existingUser) {
        return {
            status: StatusCodes.CONFLICT,
            data: null
        };
    }
    if (!dbUser) {
        const newUser=await createUser(name);
        if(newUser.status !== StatusCodes.CREATED){
            return {
                status: newUser.status,
                data: null
            };
        }
        dbUser = newUser.data;
    }
    const transaction = await sequelize.transaction();
    const user = await OAuthAccount.create({
        oAuthId: id,
        oAuthProvider: provider,
        userId: dbUser!.userId
    });
    await user.save()
    console.log(`User ${dbUser!.userName} registered with ${provider} account.`);
    await transaction.commit();
    return {
        status: StatusCodes.CREATED,
        data: user
    };
}