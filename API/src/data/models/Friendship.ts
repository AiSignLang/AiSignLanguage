import {Model, Table, Column, DataType, ForeignKey, PrimaryKey} from "sequelize-typescript";
import User from "./User";

@Table({
    timestamps: true,
    tableName: 'friendships',
    modelName: 'Friendship'
})
class Friendship extends Model {
    @PrimaryKey
    @ForeignKey(()=>User)
    @Column(DataType.UUID)
    declare userId: string;

    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare friendId: string;
}

export default Friendship;