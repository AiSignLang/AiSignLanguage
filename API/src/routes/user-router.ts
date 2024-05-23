import express from "express";
import Users from "../data/models/User";
import {StatusCodes} from "http-status-codes";
import sequelize from "../data/database";
import multer from 'multer';
import * as path from "node:path";
import {convertToWebp, deleteFile, isNameLengthValid} from "../Utils";
import e from "express";
import Score from "../data/models/Score";

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
        cb(null, path.join(__dirname, '../public/avatars'));
    },
    filename: (req, file, cb) => {
        // Extract the name from the request body
        const name = req.body.name;
        // Replace spaces with underscores and append '_pfp'
        const filename = `${name.replace(/\s+/g, '_')}_pfp${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

// Create the multer instance
const upload = multer(
    {
        storage: storage,
        fileFilter(req: e.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
            console.log("check file", file);
            const checkMimeType = file.mimetype .includes("image/")
            console.log("checkMimeType", checkMimeType);
            if (checkMimeType) {
                // Convert the file to WebP format
                convertToWebp(file.path, true,req.body.name).then((conversionResult) => {
                    if (!conversionResult) {

                        callback(new Error(": Failed to convert the image to WebP format."));
                    } else {
                        return callback(null, true)
                    }    
                });
            } else {
                callback(new Error(": Failed to convert the image to WebP format."));
            }
        }
    });



userRouter.post("/", upload.single('avatar'), async (req,res)=>{
    const name = req.body.name;
    const score = req.body.score;

    const fileName = `${name.replace(/\s+/g, '_')}_pfp.jpg`;
    const userExists = await Users.findOne({where: {userName: name}});
    if(!score||userExists){ 
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const transaction = await sequelize.transaction();
    try{
        const user = await Users.create({userName: name, profilePic: `${name}_64.webp`}); // TODO: add User should be done correctly                alex: sollte correct sein
        user.score = await Score.create({dailyStreak: score.dailyStreak, perfectlyDone:score.perfectlyDone,allTimeCorrect:score.allTimeCorrect ,ownerId: user.userId});
        res.json(user);
        await transaction.commit();
    }catch(err){
        await transaction.rollback();
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

userRouter.delete("/:username", async (req, res) => {

    const username = req.params.username;

    if(!username || username.length > 20 || username.length <= 1){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }


    try{
        const user = await Users.findOne({where: {username: username}});

        if(user === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        if(user.profilePic !== '../public/avatars/Default_pfp.jpg'){// TODO: what if user is named Default? / should not allow
            await deleteFile(user.profilePic);
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