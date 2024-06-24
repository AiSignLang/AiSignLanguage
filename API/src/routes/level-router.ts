import express from "express";
import {StatusCodes} from "http-status-codes";
import Level from "../data/models/Level";
import {isIDValid} from "../Utils";
import Score from "../data/models/Score";
import {Authorize} from "../middleware/authorization-middleware";
import User from "../data/models/User";
import Task from "../data/models/Task";

export const levelRouter = express.Router();

levelRouter.get("/", async (_, res) => {

        try{
            const levels = await Level.findAll();

            if(levels.length === 0){
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }

            res.json(levels);

    }catch (err) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

levelRouter.get("/next",Authorize, async (req:any, res) =>{
    if (!req.user){
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    const current = await User.findOne({
        where:{
            userName:req.user.userName
        },
        include: Level
    })
    const index = current?.levelNumber;
    if (index === undefined){
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    const level = await Level.findOne({
        where: {
            levelNumber: index+1
        },
        include: Task
    })
    if (level === null){
        console.log("Level not found");
        const levels = await Level.findAll();
        console.log(levels);
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }
    res.json(level);
});

levelRouter.get("/:index", async (req,res)=>{
    let index = parseInt(req.params.index);
    if(!req.params.index || isNaN(index) || index < 0){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }


    try{
        const level = await Level.findOne({
            where: {
                levelNumber: ++index
            }
        })

        if(level === null){
            // TODO: create a level -> in the future
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(level);
    }catch(err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        console.error(err);
    }
})