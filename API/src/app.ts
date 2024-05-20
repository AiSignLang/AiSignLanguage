import express from "express";
const app = express();
import  "./data/database";
import sequelize from "./data/database";

app.use(express.static("public"));
app.use(express.json());
sequelize.sync({force:true});

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});