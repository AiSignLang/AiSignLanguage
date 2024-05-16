import {DataTypes, ForeignKey, Model, Sequelize} from "sequelize";
import {sequelize} from "../database";
import {Users} from "./User";

export class Scores extends Model {
    
    declare dailyStreak: string;
    declare allTimeCorrect: number;
    declare perfectlyDone : number;
    declare scoreId: string;
    declare ownerId: ForeignKey<Users>
    
    public static Init = () => {
        Scores.init({
            scoreId: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            perfectlyDone:{
                type: DataTypes.NUMBER,
                allowNull:false,
                defaultValue:0
            },
            allTimeCorrect:{
                type: DataTypes.NUMBER,
                allowNull: false,
                defaultValue: 0
            },
            dailyStreak:{
                type: DataTypes.NUMBER,
                allowNull: false,
                defaultValue: 0
            }
            
        }, {
            sequelize,
            modelName: 'Score'
        });
    }
}

Scores.belongsTo(Users)
