import express from "express";
import {isIDValid} from "../Utils";
import {StatusCodes} from "http-status-codes";

export const wordRouter = express.Router();


wordRouter.get("/:levelId", (req,res)=>{

    const levelId = req.params.levelId;
    if(!levelId || !isIDValid(levelId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    
})