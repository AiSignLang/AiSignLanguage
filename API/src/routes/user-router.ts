import express from "express";
import {sequelize} from "../database";
import {Users} from "../models/User";
import {StatusCodes} from "http-status-codes";


export const userRouter = express.Router();


userRouter.get("/:id", async (req, res) => {

    const id = parseInt(req.params.id, 10);
    const transaction = await sequelize.transaction();

    try{
        const user = await Users.findByPk(id);

        if(user === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.json(user);

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        await transaction.rollback();
    }
});
