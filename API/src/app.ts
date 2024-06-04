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
export const app = express();


export const PORT: number = 5000;
export const EXTERNAL_PORT: number = 8080;

export const DOMAIN: string = "http://localhost";
export let EXTERNAL_DOMAIN: string = "http://localhost";

if (process.env.NODE_ENV === "publish") {
    EXTERNAL_DOMAIN = "http://asl.lambourne.at";
}

export const ADDRESS: string = `${DOMAIN}:${PORT}`;
export const EXTERNAL_ADDRESS: string = `${EXTERNAL_DOMAIN}:${EXTERNAL_PORT}`;


app.use(express.static("public"));
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/friends", friendRouter);
app.use("/auth/google-auth/", googleAuthRouter);

if (!fs.existsSync(path.join(__dirname, '../data/db.sqlite3'))) {
    sequelize.sync({force: true}).then(async () => {
        console.log('Database created');
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


app.listen(PORT, () => {
    console.log(`Server is running at ${ADDRESS}`);
    console.log(`External Server is running at ${EXTERNAL_ADDRESS}`);
});