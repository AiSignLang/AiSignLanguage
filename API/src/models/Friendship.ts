import {DataTypes, Model, Sequelize} from "sequelize";
import {sequelize} from "../database";

export class Friendship extends Model {
    declare userId: string;
    declare friendId: string;

    public static Init = () => {
        Friendship.init({
            userId: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'Users', // name of Source model
                    key: 'userId', // key in Source model that we're referencing
                },
            },
            friendId: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'Users', // name of Source model
                    key: 'userId', // key in Source model that we're referencing
                },
            }
        }, {
            sequelize,
            modelName: 'Friendship'
        });
    }
}