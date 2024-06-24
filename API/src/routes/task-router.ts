import express from "express";
import {isIDValid} from "../Utils";
import {StatusCodes} from "http-status-codes";
import Task from "../data/models/Task";

export const taskRouter = express.Router();


taskRouter.get("/:levelId", async (req,res)=>{

    const levelId = req.params.levelId;
    if(!levelId || !isIDValid(levelId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const tasks = await Task.findAll({
        where:{
            levelId: levelId
        }
    });

    if(tasks.length === 0){
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    res.json(tasks);
})

taskRouter.get("/task/:taskId", async(req,res) => {
    const taskId = req.params.taskId;
    if(!taskId || !isIDValid(taskId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const task = await Task.findByPk(taskId);

    if(task === null){
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    res.json(task);
})