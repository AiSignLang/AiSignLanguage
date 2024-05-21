import sequelize from "../database";
import User from "./User";
import {
    Model,
    BelongsTo,
    Column,
    ForeignKey,
    HasOne,
    PrimaryKey,
    Table,
    IsUUID,
    UpdatedAt,
    CreatedAt, DataType, IsInt
} from "sequelize-typescript";

@Table({
    timestamps:true,
    tableName: 'scores',
    modelName: 'Score'
})
class Score extends Model {
    
    @IsInt
    @Column({
        type: DataType.INTEGER
    })
    declare dailyStreak: number;
    
    @IsInt
    @Column({
        type: DataType.INTEGER
    })
    declare allTimeCorrect: number;
    
    @IsInt
    @Column({
        type:DataType.INTEGER
    })
    declare perfectlyDone : number;
    
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare scoreId: string;
    
    @ForeignKey(()=>User)
    @IsUUID(4)
    @Column({
        type: DataType.UUID
    })
    declare ownerId: string

    @BelongsTo(() => User,'userId')
    declare owner: User
    
    @UpdatedAt
    declare updated_at: Date
    
    @CreatedAt
    declare created_at: Date
    
}

export default Score;