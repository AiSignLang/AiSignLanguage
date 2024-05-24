import express from "express";
import  "./data/database";
import sequelize from "./data/database";
import {userRouter} from "./routes/user-router";
import user from "./data/models/User";
import Task from "./data/models/Task";
import Score from "./data/models/Score";
import * as path from "node:path";
export const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use("/api/user", userRouter)
/* just testing
sequelize.sync({force:true}).then(async () => {
    const u =await user.create({
        userName: "test",
    })
    const score = await Score.create({
        dailyStreak: 5,
        allTimeCorrect: 10,
        perfectlyDone: 2,
        ownerId: u.id // assuming 'ownerId' is the foreign key in the Score model
    });

// Associate the Score with the User
    u.score = score;
    await u.save();
});*/

path.join()

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});