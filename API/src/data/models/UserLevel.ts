import {Column, DataType, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import User from "./User";
import Level from "./Level";

@Table({
    timestamps: false,
    tableName: 'userLevels',
    modelName: 'UserLevel'
})
class UserLevel extends Model{
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare userId: string;

    @PrimaryKey
    @ForeignKey(() => Level)
    @Column(DataType.UUID)
    declare levelId: string;
}
export default UserLevel;