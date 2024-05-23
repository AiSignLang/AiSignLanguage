import express from "express";
import {StatusCodes} from "http-status-codes";
import Level from "../data/models/Level";
import {isIDValid} from "../Utils";
import Score from "../data/models/Score";
import level from "../data/models/Level";


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
// TODO: raus hier, in Code auslagern
levelRouter.post("/", async (req, res) => {

    try{
        const level = await Level.create();
        res.json(level);
    }catch(err){
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


// TODO: raus hier, in Code auslagern
levelRouter.put("/:levelId", async (req, res) => {
    const levelId = req.params.levelId;
    const level = await Level.findByPk(levelId);

    if(!levelId || levelId.length !== 36 || level === null){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const levelName = req.body.levelName ? level!.levelName : 'Default Level';

    try {
        const [updated] = await Level.update({ levelName }, {
            where: { levelId: levelId }
        });

        if (updated) {
            const updatedLevel = await Level.findOne({ where: { levelId: levelId } });
            res.json(updatedLevel);
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

