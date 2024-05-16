import {Sequelize, DataTypes, Model} from "sequelize";
import {INITIALLY_DEFERRED} from "sequelize/types/deferrable";
import {Users} from "./models/User"
import {Scores} from "./models/Score";
export const sequelize = new Sequelize('sqlite::memory:');

export function Init(){
    Users.Init()
    Scores.Init()
}