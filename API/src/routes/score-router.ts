import express from "express";
import {StatusCodes} from "http-status-codes";
import Score from "../data/models/Score";
import {lengthValidation} from "../Utils";
import Users from "../data/models/User";


export const scoreRouter = express.Router();


scoreRouter.get("/", async (_, res) => {

    try{
        const scores = await Score.findAll();
        if(scores.length === 0){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        res.json(scores);

    }catch (err) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

scoreRouter.get("/:scoreId", async (req, res) => {

    const scoreId = req.params.scoreId;

    if(!scoreId || scoreId.length !== 36){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const score = await Score.findByPk(scoreId);
        if(score === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.json(score);
    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})


