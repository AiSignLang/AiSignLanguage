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
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

const storage = multer.diskStorage({
    destination: (_, file, cb) => {
        
        cb(null, path.join(__dirname, '../../public/temp/'));
        console.log("in destination of multer: " + file.originalname);
    },
    filename: (_, file, cb) => {

        const filename = `${uuidv4()}.${path.extname(file.originalname)}`;//`${name.replace(/\s+/g, '_')}_pfp.${path.extname(file.originalname)}`; // muss denk ich fürs konvertieren den ext-namen haben
        cb(null, filename);
        console.log("in filename of multer: " + filename);

    }
});

// Create the multer instance
const upload = multer(
    {
        storage: storage,
        fileFilter(req, file: Express.Multer.File, callback: multer.FileFilterCallback) {
            console.log("check file", file);
            console.log("checking request: " + req);
            const checkMimeType = file.mimetype.includes("image/")
            console.log("checkMimeType", checkMimeType);
            if (checkMimeType) {
                return callback(null, true)

            } else {
                callback(new Error(": Failed to convert the image to WebP format."));
            }
        }
    });



userRouter.post("/",async (req,res)=>{
    const name = req.body.name;
    const user = await Users.findOne({where: {userName: name}}); // TODO: in html action is /api/user/ post, maybe put, but where to get username?
    console.log(name);
    if(user){
        console.log("crashes in here");
        console.log(user.userName);
        console.log(typeof user);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const transaction = await sequelize.transaction();
    try{
        const user = await Users.create({userName: name});
        user.score = await Score.create({dailyStreak: 0, perfectlyDone:0,allTimeCorrect:0 ,ownerId: user.userId});
        res.status(StatusCodes.CREATED).json(user);
        await transaction.commit();
    }catch(err){
        await transaction.rollback();
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

userRouter.put("/:username/avatar", upload.single('avatar'), async (req, res) => {
    const username = req.params.username;

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
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    const t =await sequelize.transaction()
    user.profilePic = images[4];
    await t.commit();
    res.json(user);
})

userRouter.delete("/:username", async (req, res) => {

    const username = req.params.username;

    if(!username || !isNameLengthValid(username)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }


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

        res.sendStatus(StatusCodes.NO_CONTENT);

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})


userRouter.put("/:username", async (req, res) => {
    const userName = req.params.username;
    const user = await Users.findOne({where: {username: userName}});

    if(!isNameLengthValid(userName)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const profilePic = req.body.profilePic ? user!.profilePic : '../public/avatars/Default_pfp.jpg'; // TODO: im service pfp lösen

    try {
        const [updated] = await Users.update({ userName, profilePic }, {
            where: { username: userName }
        });

        if(!updated){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        const updatedUser = await Users.findOne({ where: { username: userName } });
        res.json(updatedUser);

    } catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

userRouter.delete("/", async (req, res) => {

    try{
        await Users.destroy({where: {}});
        res.sendStatus(StatusCodes.NO_CONTENT);
    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

});