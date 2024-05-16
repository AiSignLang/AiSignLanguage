import express from "express";
import { User  } from "./models/User";
const app = express();

app.use(express.static("public"));
app.use(express.json());



app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});