import express from "express";
import Users from "../data/models/User";
import {StatusCodes} from "http-status-codes";
import sequelize from "../data/database";
import multer from 'multer';
import * as path from "node:path";
import {convertToWebp, deleteFile, getAvatarPath, getUserPath, isNameLengthValid} from "../Utils";
import {v4 as uuidv4} from "uuid";
import fsSync from "fs";
import * as fs from "node:fs";
import {createUser} from "../services/user-service";
import {Authorize} from "../middleware/authorization-middleware";
import config from "../config";
import {setAvatar} from "../services/avatar-service";
import user from "../data/models/User";
import {AuthRequest} from "../model";

export const userRouter = express.Router();
userRouter.use(Authorize);
userRouter.get("/", async (_, res) => {

    try{
         const users = await Users.findAll();

         if(users.length === 0){
             res.sendStatus(StatusCodes.NO_CONTENT);
             return;
         }

         res.json(users)

   }catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
   }
});

userRouter.get("/me", async (req: any, res) => {
    if (!req.user){
        return res.status(StatusCodes.NOT_FOUND).send('Unauthorized');
    }
    
    return res.json(req.user);
});

userRouter.post("/validate-username", async (req, res) => {
    const username = req.body.username;
    if (!username || !isNameLengthValid(username)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const user = await Users.findOne({where: {username: username}});
    if(user){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    res.status(StatusCodes.OK).send({message:'Username is valid'});
});

userRouter.get("/:username", async (req: any, res) => {
    if (!req.user){
        console.log(req.user);
        return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized');
    }
    if (req.user.userName !== req.params.username){
        console.log(req.user);
        return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized');
    }
    const username = req.params.username;

    try{
        const user = await Users.findOne({
            where: 
                {
                    username: username
                },
            include: {all: true, nested: true}
        });
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
    if (!req.file) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    const result  = await setAvatar(username, req.file);
    if(result.status === StatusCodes.OK){
        res.json(result.data);
    }
    else {
        res.sendStatus(result.status);
    }
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

        if(!user.hasProfilePic()){// TODO: what if user is named Default? / should not allow
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

userRouter.patch("/:username", async (req, res) => {
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