import {Column, DataType, HasMany, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";
import Task from "./Task";

@Table({
    timestamps: true,
    tableName: 'levels',
    modelName: 'Level'
})
class Level extends Model{
    
    @Column
    declare levelName: string;
    
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare levelId: string;

    @HasMany(()=>Task,'levelId')
    declare tasks: Task[]
}
export default Level;