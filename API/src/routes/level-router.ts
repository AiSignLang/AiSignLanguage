import express from "express";
import {StatusCodes} from "http-status-codes";
import Level from "../data/models/Level";
import {isIDValid} from "../Utils";
import Score from "../data/models/Score";

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

levelRouter.get("/:levelId", async (req, res) => {
    const levelId = req.params.levelId;

    if(!isIDValid(levelId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const level = await Score.findByPk(levelId);
        if(level === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        res.json(level);

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

});

levelRouter.delete(":levelId", async (req, res) => {
    const levelId = req.params.levelId;

    if(!isIDValid(levelId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const score = await Score.findByPk(levelId);
        if(score === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        await score.destroy();
        res.sendStatus(StatusCodes.NO_CONTENT);

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})