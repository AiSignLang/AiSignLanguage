import {
    Association,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Sequelize,
    CreationOptional
} from "sequelize";
import {sequelize} from "../database";
import {Scores} from "./Score";

export class Users extends Model
    <InferAttributes<Users, {omit: 'score'}>,
        InferCreationAttributes<Users,{omit: 'score'}>> {
    
    declare userName: string;
    declare profilePic: CreationOptional<string>;
    declare userId: string;
    
    
    declare score: NonAttribute<Scores>
    declare static associations: {
        score: Association<Users,Scores>;
    }
    
    
    public static Init = () => {
        Users.init({
            userId: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            userName: "",
            profilePic: ""
        }, {
            sequelize,
            modelName: 'User'
        });
    }
}

Users.hasOne(Scores,{
    sourceKey: 'scoreId',
    
})




