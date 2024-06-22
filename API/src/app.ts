﻿import express from "express";
import  "./data/database";
import sequelize from "./data/database";
import {userRouter} from "./routes/user-router";
import * as path from "node:path";
import {friendRouter} from "./routes/friend-router";
import googleAuthRouter from "./routes/auth/google-auth-router";
import * as fs from "node:fs";
import config from "./config";

import cors from "cors";
import aslAuthRouter from "./routes/auth/asl-auth-router";
import {configDotenv} from "dotenv";
export const app = express();
configDotenv()

if(!process.env.ASL_SECRET ||
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET){
    throw new Error('Environment variables not set');
}

app.use(config.staticEndpoint,express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/friends", friendRouter);
app.use("/oauth/google-auth/", googleAuthRouter);
app.use("/oauth/asl-auth/", aslAuthRouter);
if (!fs.existsSync(path.join(__dirname, '../data/db.sqlite3'))) {
    sequelize.sync({force: true}).then(async () => {
        console.log('Database synchronized');
    });
    sequelize.createSchema('test',{logging: true}).then(() => {
        console.log('Schema created');
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


const server = app.listen(config.port, () => {
    console.log(`Server is running at ${config.address}`);
    console.log(`External Server is running at ${config.externalAddress}`);
});

export { server};