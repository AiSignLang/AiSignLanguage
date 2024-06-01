import {Column, DataType, HasMany, IsUUID, Model, PrimaryKey, Table} from "sequelize-typescript";
import Task from "./Task";
import {isString} from "../../Utils";

@Table({
    timestamps: true,
    tableName: 'levels',
    modelName: 'Level'
})
class Level extends Model{
    @Column({
        type: DataType.STRING,
        validate: {
            isString: isString
        }
    })
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

