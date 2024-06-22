import { readFile } from "../Utils";
import sequelize from "./database";
import Level from "./models/Level";
import * as os from "node:os";
import Task from "./models/Task";

export async function initDB(){
    const transaction = await sequelize.transaction();

    try{
        const levelContent = await readFile("../data/level.csv",true);
        const levelNames = levelContent.split(os.EOL);

        for(const name of levelNames.slice(1,levelNames.length)){
            await Level.create({
                levelName: name
            });
        }

        const levels = await Level.findAll();

        const taskContent = await readFile("../data/words.csv",true);
        const tempTaskLines = taskContent.split(os.EOL);
        const  taskLines = tempTaskLines.slice(1,tempTaskLines.length);

        let idx = -1;

        for(let i = 0; i < taskLines.length; i++){
            const task = taskLines[i].split(';');
            if(i % 5 === 0){
                idx++;
            }

            await Task.create({
                taskName: task[0],
                words: task[1],
                videoPath: task[2],
                levelId: levels[idx].levelId
            });
        }

        await transaction.commit();

    }catch(err){
        console.error('Unable to connect to the database: ', err);
        await transaction.rollback();
    }
}