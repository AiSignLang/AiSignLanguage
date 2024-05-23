import express from "express";
import Mistake from "../data/models/Mistake";
import {StatusCodes} from "http-status-codes";
import Score from "../data/models/Score";
import {isIDValid} from "../Utils";

export const mistakeRouter = express.Router();

mistakeRouter.post("/", async (req, res) => {
    const taskId = req.body.taskId;

    if(!taskId || !isIDValid(taskId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const mistake = await Mistake.create({taskId: taskId});
        res.json(mistake);
    }catch(err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

mistakeRouter.get("/", async (_, res) => {

    try {
        const mistakes = await Mistake.findAll();

        if(mistakes.length === 0){
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(mistakes);
    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

mistakeRouter.get("/:mistakeId", async (req, res) => {

    const mistakeId = req.params.mistakeId;

    if(!isIDValid(mistakeId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const score = await Score.findByPk(mistakeId);
        if(score === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.json(score);
    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

mistakeRouter.delete("/:mistakeId", async (req, res) => {

    const mistakeId = req.params.mistakeId;

    if(!mistakeId || !isIDValid(mistakeId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try {
        const mistake = await Mistake.findByPk(mistakeId);

        if (mistake === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        await mistake.destroy();
        res.sendStatus(StatusCodes.NO_CONTENT);
    }catch(err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

