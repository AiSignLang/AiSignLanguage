import {
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Is,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import Task from "./Task";
import User from "./User";

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

    @IsUUID(4)
    @ForeignKey(()=>User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string;
    
    @CreatedAt
    declare created_at: Date

    @UpdatedAt
    declare updated_at: Date
}
export default Mistake;