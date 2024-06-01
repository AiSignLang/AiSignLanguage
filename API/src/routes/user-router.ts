import express from "express";
import sequelize from "../data/database";
import Users from "../data/models/User";
import {StatusCodes} from "http-status-codes";

export const userRouter = express.Router();

userRouter.get("/", async (_, res) => {

    try{
         const users = await Users.findAll();

         if(users.length === 0){
             res.sendStatus(StatusCodes.NO_CONTENT); // TODO: or not found message ?
             return;
         }

         res.json(users);

   }catch (err) {
       res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
   }
});


userRouter.get("/:id", async (req, res) => {

    const id = parseInt(req.params.id, 10);

    if(isNaN(id)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const user = await Users.findByPk(id);

        if(user === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        res.json(user);

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

userRouter.post("/", async (req,res)=>{
    const name = req.body.name;
    const score = req.body.score;
    const profilePath = req.body.profilePath; // TODO: wie wird bild geaddet?

    if(!name || name.length > 18 || !score){ // TODO: done?
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    // TODO: validation should be done in front end file ???
    const transaction = await sequelize.transaction();
    try{
        const user = await Users.create(); // TODO: add User should be done correctly
        res.json(user);
        await transaction.commit();
    }catch(err){
        await transaction.rollback();
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

userRouter.delete("/:id", async (req, res) => {

    const id = parseInt(req.params.id, 10);

    if(isNaN(id)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const user = await Users.findByPk(id);

        if(user === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        await user.destroy();
        res.sendStatus(StatusCodes.NO_CONTENT);

    }catch (err){
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})


userRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { userName, profilePic } = req.body;

    // Basic validation example
    if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    // TODO: should retrieve values from database, in case user just updates one value
    try {
        // Attempt to update the user
        const [updated] = await Users.update({ userName, profilePic }, {
            where: { userId: id }
        });

        if (updated) {
            const updatedUser = await Users.findByPk(id);
            res.json(updatedUser);
        } else {
            // No user was updated, likely because the user was not found
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});