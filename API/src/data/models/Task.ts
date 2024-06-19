import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    HasMany,
    IsUUID,
    Model,
    PrimaryKey,
    Table, UpdatedAt
} from "sequelize-typescript";
import Level from "./Level";
import Mistake from "./Mistake";
import {isString} from "../../Utils";

@Table({
    timestamps: true,
    tableName: 'tasks',
    modelName: 'Task'
})
class Task extends Model{
    @Column({
        type: DataType.STRING,
        validate: {
            isString: isString
        }
    })
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

    @Column({
        type: DataType.STRING,
        validate: {
            isString: isString
        }
    })
    declare words: string;

    @Column({
        type: DataType.STRING,
        validate: {
            isString: isString
        }
    })
    declare videoPath: string;
    
    @BelongsTo(()=>Level)
    declare level: Level;
    
    @HasMany(()=>Mistake,'taskId')
    declare mistakes: Mistake[]

    @CreatedAt
    declare created_at: Date

    @UpdatedAt
    declare updated_at: Date
}
export default Task;