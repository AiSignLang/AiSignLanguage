import express from "express";
import Users from "../data/models/User";
import {StatusCodes} from "http-status-codes";
import sequelize from "../data/database";
import multer from 'multer';
import * as path from "node:path";
import {convertToWebp, deleteFile, getAvatarPath, getUserPath, isNameLengthValid} from "../Utils";
import Score from "../data/models/Score";
import {v4 as uuidv4} from "uuid";
import fsSync from "fs";
import * as fs from "node:fs";
import {ADDRESS} from "../app";
import {createUser} from "../services/user-service";

export const userRouter = express.Router();

userRouter.get("/", async (_, res) => {

    try{
         const users = await Users.findAll();

         if(users.length === 0){
             res.sendStatus(StatusCodes.NOT_FOUND);
             return;
         }

         res.json(users)

   }catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
   }
});

userRouter.get("/:username", async (req, res) => {
    const username = req.params.username;

    if(!isNameLengthValid(username)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const user = await Users.findOne({where: {username: username}});
        if(user === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.json(user);
    }catch (err){
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

const storage = multer.diskStorage({
    destination: (_, file, cb) => {

        cb(null, path.join(__dirname, '../../public/temp/'));
    },
    filename: (_, file, cb) => {

        const filename = `${uuidv4()}.${path.extname(file.originalname)}`;//`${name.replace(/\s+/g, '_')}_pfp.${path.extname(file.originalname)}`; // muss denk ich fürs konvertieren den ext-namen haben
        cb(null, filename);
    }
});

// Create the multer instance
const upload = multer(
    {
        storage: storage,
        fileFilter(req, file: Express.Multer.File, callback: multer.FileFilterCallback) {
            const checkMimeType = file.mimetype.includes("image/")
            if (checkMimeType) {
                return callback(null, true)

            } else {
                callback(new Error(": Failed to convert the image to WebP format."));
            }
        }
    });



userRouter.post("/",async (req,res)=>{
    const newUser = await createUser(req.body.username)
    if(newUser.status === StatusCodes.CREATED){
        res.status(newUser.status).json(newUser.data);
    }else {
        res.sendStatus(newUser.status);
    }
})

userRouter.put("/:username/avatar", upload.single('avatar'), async (req, res) => {
    const username = req.params.username;

    //const profilePic = req.body.profilePic ? user!.profilePic : '../public/avatars/Default_pfp.jpg'; // TODO: im service pfp lösen

    const user = await Users.findOne({where: {username: username}});
    if(!user){
        res.sendStatus(StatusCodes.NOT_FOUND);
        if (req.file)
            await  deleteFile(req.file.path);
        return;
    }
    if (!req.file) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    if (fsSync.existsSync(getAvatarPath(username))) {
        fs.rmdirSync(getAvatarPath(username),{recursive: true});
    }
    fs.mkdirSync(getAvatarPath(username), {recursive: true});
    const avatarDir = getAvatarPath(username) + req.file.filename;
    fs.renameSync(req.file.path, avatarDir );
    const images = await convertToWebp(avatarDir, true, username.replace(/ /g, '_'));

    if (!images) {
        res.sendStatus(StatusCodes.BAD_REQUEST); // TODO: should test this
        return;
    }
    const t =await sequelize.transaction(); // TODO: transaction should be used, when updating db, but no db found ???
    user.profilePic = `${ADDRESS}/${username}/avatars/${images[4]}`;
    await t.commit();
    res.json(user);
})

userRouter.delete("/:username", async (req, res) => {

    const username = req.params.username;

    if(!username || !isNameLengthValid(username)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const transaction = await sequelize.transaction();
    try{
        const user = await Users.findOne({where: {username: username}});

        if(user === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        if(!user.profilePic.includes("Default_pfp.webp")){// TODO: what if user is named Default? / should not allow
            fs.rmdirSync(getUserPath(username),{recursive: true});
        }
        await user.destroy();
        await transaction.commit();

        res.sendStatus(StatusCodes.NO_CONTENT);

    }catch (err){
        console.error(err);
        await transaction.rollback();
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

userRouter.put("/:username", async (req, res) => {
    const userName = req.params.username;
    const newUserName = req.body.name;
    const user = await Users.findOne({where: {username: userName}});

    if(!userName || !newUserName
        || !isNameLengthValid(userName) || !isNameLengthValid(newUserName)
        || !user){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const userExists = await Users.findOne({where: {username: newUserName}});
    if(userExists){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const transaction = await sequelize.transaction();
    try {
        await user.update({userName: newUserName});

        const updatedUser = await Users.findOne({ where: { username: newUserName } });
        await transaction.commit();
        res.json(updatedUser);

    } catch (err) {
        console.error(err);
        await transaction.rollback();
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

userRouter.delete("/", async (_, res) => {

    const transaction = await sequelize.transaction();
    try{
        await Users.destroy({where: {}});
        res.sendStatus(StatusCodes.NO_CONTENT);
        await transaction.commit();
    }catch (err){
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        await transaction.rollback();
    }
});