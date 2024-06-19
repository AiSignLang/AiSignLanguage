import Users from "../data/models/User";
import {StatusCodes} from "http-status-codes";
import {convertToWebp, deleteFile, getAvatarPath, getStaticUrl} from "../Utils";
import fsSync from "fs";
import fs from "node:fs";
import sequelize from "../data/database";
import config from "../config";
import {AvatarFile, ServiceReturn} from "../model";
import User from "../data/models/User";

export async function setAvatar(username:string, file:AvatarFile): Promise<ServiceReturn<User>>{
    const user = await Users.findOne({where: {username: username}});
    if (!user) {
        if (file){
            await deleteFile(file.path);
        }
        return {
            status: StatusCodes.NOT_FOUND,
            data: null
            };
    }
    if (fsSync.existsSync(getAvatarPath(username))) {
        fs.rmdirSync(getAvatarPath(username), {recursive: true});
    }
    fs.mkdirSync(getAvatarPath(username), {recursive: true});
    const avatarDir = getAvatarPath(username) + file.filename;
    fs.renameSync(file.path, avatarDir);
    const images = await convertToWebp(avatarDir, true, username.replace(/ /g, '_'));

    if (!images) {
        return {
            status: StatusCodes.BAD_REQUEST,
            data: null
        };
    }
    const t = await sequelize.transaction(); // TODO: transaction should be used, when updating db, but no db found ???
    user.profilePic = getStaticUrl(images[4]);
    await user.save();
    await t.commit();
    return {
        status: StatusCodes.OK,
        data: user
    };
}