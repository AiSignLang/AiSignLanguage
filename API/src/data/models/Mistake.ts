import {Column, DataType, ForeignKey, Is, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";
import Task from "./Task";

@Table({
    timestamps: true,
    tableName: 'mistakes',
    modelName: 'Mistake'
})
class Mistake extends Model{
    @IsUUID(4)
    @ForeignKey(()=>Task)
    @Column({
        type: DataType.UUID
    })
    declare taskId: string;
    
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare mistakeId: string;
}
export default Mistake;