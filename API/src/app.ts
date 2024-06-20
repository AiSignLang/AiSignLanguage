import express from "express";
import  "./data/database";
import sequelize from "./data/database";
import {userRouter} from "./routes/user-router";
import * as path from "node:path";
import {friendRouter} from "./routes/friend-router";
import googleAuthRouter from "./routes/auth/google-auth-router";
import * as fs from "node:fs";
import config from "./config";

import cors from "cors";
import {initDB} from "./data/init";
import Level from "./data/models/Level";
export const app = express();

app.use(config.staticEndpoint,express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/friends", friendRouter);
app.use("/auth/google-auth/", googleAuthRouter);
if (!fs.existsSync(path.join(__dirname, '../data/db.sqlite3'))) {
    sequelize.sync({force: true}).then(async () => {
        console.log('Database synchronized');
    });
    sequelize.createSchema('test',{logging: true}).then(() => {
        console.log('Schema created');
    });

    sequelize.sync({force: true}).then(async () => {
        initDB().then(() => {
            sequelize.sync({force: true}).then(async () => {
                console.log('Database synchronized');
                Level.findAll().then((levels) => {
                    console.log(levels);
                })
            })
        });
    })
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