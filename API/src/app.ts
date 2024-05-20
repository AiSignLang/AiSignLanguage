import express from "express";
import  "./data/database";
import sequelize from "./data/database";
import {userRouter} from "./routes/user-router";
export const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use("/api/user", userRouter)

sequelize.sync({force:true});

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});