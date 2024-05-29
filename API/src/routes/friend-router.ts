import express from "express";
import {StatusCodes} from "http-status-codes";
import User from "../data/models/User";
import {isNameLengthValid} from "../Utils";
import Friendship from "../data/models/Friendship";

export const friendRouter = express.Router();

friendRouter.get("/:username", async (req, res) => {

    const username = req.params.username;

    if(!username || !isNameLengthValid(username)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
         const user = await User.findOne(
             {where:
                     {username: username},
                    include: User
             });

         if(user === null) {
             res.sendStatus(StatusCodes.BAD_REQUEST);
             return;
         }
         const friends = user.friends;
// Could crash, bc friends might be undefined
         if(friends.length === 0){
             res.sendStatus(StatusCodes.NOT_FOUND);
             return;
         }

         res.json(friends);

   }catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
   }
})


friendRouter.post("/:username/friends/:friendUsername", async (req, res) => {
    const username = req.params.username;
    const friendUsername = req.params.friendUsername;

    if(!username || !friendUsername ||
        !isNameLengthValid(username)
        || !isNameLengthValid(friendUsername)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }


    try{
        const user = await User.findOne({where: {username: username}});
        const friend = await User.findOne({where: {username: friendUsername}});

        if(user === null || friend === null || user === friend){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        if(user.friends === undefined){
            user.friends = [];
        }

        if(!user.friends.includes(friend)){
            const friendship = await Friendship.create({userId: user.userId, friendId: friend.userId});
            await friendship.save();
            await user.save();
        }

        res.json(user.friends);

    }catch (err){
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

friendRouter.delete("/:username/friends/:friendUsername", async (req, res) => {

    const username = req.params.username;
    const friendUsername = req.params.friendUsername;

    if(!username ||
        !friendUsername ||
        !isNameLengthValid(username) ||
        !isNameLengthValid(friendUsername)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }


    try{
        const user = await User.findOne(
            {where:
                        {username: username},
                        include: User
        });
        const friend = await User.findOne(
            {where:
                    {username: friendUsername},
                    include: User
            });

        if(user === null || friend === null || user === friend){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        if(user.friends === undefined){
            user.friends = [];
        }

        const friendship = await Friendship.findOne({where: {userId: user.userId, friendId: friend.userId}})
        if(!friendship){
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        user.friends = [...user.friends.filter(f => f.userName !== friend.userName)];
        await Friendship.destroy({where: {userId: user.userId, friendId: friend.userId}});
        await user.save();
        res.json(user.friends);

    }catch (err){
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

