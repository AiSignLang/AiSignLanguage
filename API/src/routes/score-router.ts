import express from "express";
import {StatusCodes} from "http-status-codes";
import Score from "../data/models/Score";
import {isIDValid, isNameLengthValid} from "../Utils";
import Users from "../data/models/User";
import Level from "../data/models/Level";


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

scoreRouter.post("/", async (_, res) => {

    try{
        const level = await Level.create();
        res.json(level);
    }catch(err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

scoreRouter.delete("/:scoreId", async (req, res) => {

        const scoreId = req.params.scoreId;

        if(!isIDValid(scoreId)){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        try{
            const score = await Score.findByPk(scoreId);
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

scoreRouter.put("/:scoreId", async (req, res) => {

    const scoreId = req.params.scoreId;
    const score = await Score.findByPk(scoreId);

    if(!isIDValid(scoreId) || score === null){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const dailyStreak = req.body.score.dailyStreak ? req.body.score.dailyStreak : score.dailyStreak;
    const allTimeCorrect = req.body.score.allTimeCorrect ? req.body.score.allTimeCorrect : score.allTimeCorrect;
    const perfectlyDone = req.body.score.perfectlyDone ? req.body.score.perfectlyDone : score.perfectlyDone;

    try {
        const [updated] = await Score.update({ dailyStreak:dailyStreak, allTimeCorrect: allTimeCorrect, perfectlyDone: perfectlyDone }, {
            where: { scoreId: scoreId }
        });

        if (updated) {
            const updatedScore = await Score.findByPk(scoreId);
            res.json(updatedScore);
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})