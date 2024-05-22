import express from "express";
import {StatusCodes} from "http-status-codes";
import User from "../data/models/User";
import {lengthValidation} from "../Utils";


export const friendRouter = express.Router();

// TODO: hmmm... is all flag necessary? why one wanted, maybe user searches for a friend and only ... probably query more wanted here
friendRouter.get("/:username", async (req, res) => {

    const username = req.params.username;

    if(!username || username.length > 20 || username.length <= 1){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
         const user = await User.findOne({where: {username: username}});

         if(user === null) {
             res.sendStatus(StatusCodes.BAD_REQUEST);
             return;
         }
         const friends = user.friends;

         if(friends.length === 0){
             res.sendStatus(StatusCodes.NOT_FOUND);
             return;
         }

         res.json(friends);

   }catch (err) {
       res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
   }
})


friendRouter.post("/:username/friends/:friendUsername", async (req, res) => {
    const username = req.params.username;
    const friendUsername = req.params.friendUsername;

    if(!lengthValidation(username)
        || !lengthValidation(friendUsername)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }


    try{
        const user = await User.findOne({where: {username: username}});
        const friend = await User.findOne({where: {username: friendUsername}});

        if(user === null || friend === null){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        if(!user.friends.includes(friend)){
            user.friends.push(friend);
            await user.save();
        }

        res.json(user.friends);

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

friendRouter.delete("/:username/friends/:friendUsername", async (req, res) => {

    const username = req.params.username;
    const friendUsername = req.params.friendUsername;

    if(!lengthValidation(username)
        || !lengthValidation(friendUsername)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }


    try{
        const user = await User.findOne({where: {username: username}});
        const friend = await User.findOne({where: {username: friendUsername}});

        if(user === null || friend === null){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        if(!user.friends.includes(friend)){
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        const idx = user.friends.indexOf(friend);

        res.json(user.friends.splice(idx,1));

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})