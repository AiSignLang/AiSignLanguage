import {BelongsTo, Column, DataType, ForeignKey, HasMany, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";
import Level from "./Level";
import Mistake from "./Mistake";

@Table({
    timestamps: true,
    tableName: 'tasks',
    modelName: 'Task'
})
class Task extends Model{
    @Column
    declare taskName: string;
    
    @IsUUID(4)
    @PrimaryKey
    @Column({
       type:DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare taskId: string;
    
    @ForeignKey(()=>Level)
    @IsUUID(4)
    @Column({
        type: DataType.UUID
    })
    declare levelId: string;
    
    @BelongsTo(()=>Level)
    declare level: Level;
    
    @HasMany(()=>Mistake,'taskId')
    declare mistakes: Mistake[]
}
export default Task;