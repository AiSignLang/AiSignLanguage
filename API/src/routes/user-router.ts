import express from "express";
import Users from "../data/models/User";
import {StatusCodes} from "http-status-codes";
import sequelize from "../data/database";
import multer from 'multer';
import * as path from "node:path";
import {deleteFile, lengthValidation} from "../Utils";

export const userRouter = express.Router();

userRouter.get("/", async (_, res) => {

    try{
         const users = await Users.findAll();

         if(users.length === 0){
             res.sendStatus(StatusCodes.NO_CONTENT); // TODO: or not found message ?
             return;
         }

         res.json(users);

   }catch (err) {
       res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
   }
});


userRouter.get("/:username", async (req, res) => {
    const username = req.params.username;

    if(!lengthValidation(username)){
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
    destination: (req, file, cb) => {
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
const upload = multer({ storage: storage });

userRouter.post("/", upload.single('avatar'), async (req,res)=>{
    const name = req.body.name;
    const score = req.body.score;

    const fileName = `${name.replace(/\s+/g, '_')}_pfp.jpg`;
    if(!name || name.length > 18  || name.length <= 1 || !score){ // TODO: picture validation, validating picture length ?
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await deleteFile(fileName); // TODO: is converter used?
        return;
    }

    const transaction = await sequelize.transaction();
    try{
        const user = await Users.create({userName: name, profilePic: fileName}); // TODO: add User should be done correctly
        res.json(user);
        await transaction.commit();
    }catch(err){
        await transaction.rollback();
        // TODO: in database, if username exists already it throws, there this will displayed below. talk with resch. or write own exception
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

        if(user.profilePic !== '../public/avatars/Default_pfp.jpg'){// TODO: what if user is named Default?
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

    if(!userName || userName.length > 20 || userName.length <= 1){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const profilePic = req.body.profilePic ? user!.profilePic : '../public/avatars/Default_pfp.jpg'; // TODO: im service pfp lösen

    try {
        const [updated] = await Users.update({ userName, profilePic }, {
            where: { username: userName }
        });

        if (updated) {
            const updatedUser = await Users.findOne({ where: { username: userName } });
            res.json(updatedUser);
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});