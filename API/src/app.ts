import express from "express";
import  "./data/database";
import sequelize from "./data/database";
import {userRouter} from "./routes/user-router";
import user from "./data/models/User";
import Task from "./data/models/Task";
import Score from "./data/models/Score";
import * as path from "node:path";
import {friendRouter} from "./routes/friend-router";
import googleAuthRouter from "./routes/auth/google-auth-router";
import * as fs from "node:fs";
import {Authorize} from "./middleware/authorization-middleware";
import Config from "./config";
import config from "./config";

export const app = express();

app.use(config.staticEndpoint,express.static("public"));
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/friends", friendRouter);
app.use("/auth/google-auth/", googleAuthRouter);

if (!fs.existsSync(path.join(__dirname, '../data/db.sqlite3'))) {
    sequelize.sync({force: true}).then(async () => {
        console.log('Database synchronized');
    });
}
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


app.listen(config.port, () => {
    console.log(`Server is running at ${config.address}`);
    console.log(`External Server is running at ${config.externalAddress}`);
});