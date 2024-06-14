import {OAuthGoogleUserData, OAuthProvider} from "../routes/auth/model";
import OAuthAccount from "../data/models/OAuthAccount";
import User from "../data/models/User";
import sequelize from "../data/database";
import {createUser} from "./user-service";
import {StatusCodes} from "http-status-codes";
import {ServiceReturn} from "../model";
import {downloadImage, publicPath} from "../Utils";
import {setAvatar} from "./avatar-service";
import * as path from "node:path";
import {Op} from 'sequelize';

interface CreateUserCredentials
{
    id: string;
    name: string;
    familyName: string|null;
    givenName: string|null;
}

export async function registerOAuthUser(oauthUser: OAuthGoogleUserData,  provider: OAuthProvider, dbUser: User | null = null) : Promise<ServiceReturn<OAuthAccount>>
{
    let dates: CreateUserCredentials;
    // switch for different providers
    switch (provider) {
        case OAuthProvider.GOOGLE:
            dates = {
                id: oauthUser.sub,
                name: oauthUser.name,
                familyName: oauthUser.family_name,
                givenName: oauthUser.given_name 
            }
            break;
    }
    
    const existingUser = await OAuthAccount.findOne({
        where: {
            oAuthId: dates.id,
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
        const newUser = await createValidUser(dates);
        dbUser = newUser.data;
    }
    if (dbUser && !dbUser.hasProfilePic()) {
        const outPath = path.join(publicPath, 'temp');
        const file = await downloadImage(oauthUser.picture, outPath);
        await setAvatar(dbUser.userName, {
            path: file,
            filename: `${dbUser.userName}.${path.extname(file)}`
        })
    }
    const transaction = await sequelize.transaction();
    try {
        const user = await OAuthAccount.create({
            oAuthId: dates.id,
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
   catch (e) {
        await transaction.rollback();
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null
        };
   }
}

async function createValidUser(dates:CreateUserCredentials): Promise<ServiceReturn<User>>{
    let newUser: ServiceReturn<User> | undefined = undefined;
    console.log("dates",dates);
    console.log("user",newUser);
    for (const name of [dates.name,dates.givenName,dates.familyName]){
        if (!name) continue;
        newUser = await createUser(name);
        console.log(dates);
        console.log(newUser);
        if (newUser.status === StatusCodes.CREATED) {
            return newUser;
        }
    }
    // wenn kein freier gefunden wurde
    if (!newUser ||newUser.status === StatusCodes.CONFLICT) {
        const nextUser = await User.findAll({
            where: {
                userName: {
                    [Op.regexp]: `^${dates.name}[0-9]*`
                }
            }
        });
        //get numbers from usernames
        const numbers = nextUser.map(user => {
            const match = user.userName.match(new RegExp(`^${dates.name}([0-9]*)`));
            return match ? parseInt(match[1], 10) : null;
        }).filter(number => number !== null);

        // Sortieren Sie die Zahlen in aufsteigender Reihenfolge
        numbers.sort((a, b) => a! - b!);

        // Finden Sie die erste "Lücke" in der Sequenz
        let nextFreeNumber = 1;
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] !== i + 1) {
                nextFreeNumber = i + 1;
                break;
            }
        }
        return await createUser(`${dates.name}${nextFreeNumber}`);
    }
    return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null
    };
}

export async function getOAuthUser(oauthId: string, provider: OAuthProvider): Promise<User | null> {
    const account = await OAuthAccount.findOne({
        where: {
            oAuthId: oauthId,
            oAuthProvider: provider
        }
    });
    if (!account) {
        return null;
    }
    return User.findOne({
        where: {
            userId: account.userId
        }
    });
}