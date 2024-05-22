import express from "express";
import {StatusCodes} from "http-status-codes";
import Level from "../data/models/Level";


export const levelRouter = express.Router();

levelRouter.get("/", async (_, res) => {

        try{
            const levels = await Level.findAll();

            if(levels.length === 0){
                res.sendStatus(StatusCodes.NOT_FOUND); // TODO: or not found message ?
                return;
            }

            res.json(levels);

    }catch (err) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

levelRouter.get("/:level", async (req, res) => {
    // TODO: hmm..., levelID is long string, should we still use that?
});

levelRouter.post("/", async (req, res) => {


});

