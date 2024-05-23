import {
    Column,
    HasMany,
    Table,
    Model,
    BelongsTo,
    HasOne,
    PrimaryKey,
    IsUUID,
    CreatedAt,
    UpdatedAt, DataType, BelongsToMany
} from "sequelize-typescript";
import Score from "./Score";
import Friendship from "./Friendship";
import Level from "./Level";
import UserLevel from "./UserLevel";
import {ValidationFailed} from "sequelize-typescript/dist/browser";
import {isString} from "../../Utils";

@Table({
    timestamps: true,
    tableName: 'users',
    modelName: 'User'
})
class User extends Model {
    
    @Column({
        allowNull: false,
        type:DataType.STRING,
        validate: {
            notEmpty: {
                msg: "Username cannot be an empty string"
            },
            isString: isString,
            isUnique: async function (value: string) {
                const user = await User.findOne({where: {userName: value}});
                if (user) {
                    throw new Error('Username already exists');
                }
            }
        }
    })
    declare userName: string;
    
    @Column({
        allowNull: false,
        type:DataType.STRING,
        defaultValue: 'Default_pfp.jpg'
    })
    declare profilePic: string;
    
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare userId: string;
    
    @BelongsToMany(()=>User,()=>Friendship,'userId','friendId')
     declare friends: User[];
    
    @HasOne(()=>Score,'ownerId')
    declare score:Score
    
    @CreatedAt
    declare created_at: Date
    
    @UpdatedAt
    declare updated_at:Date
    
    @BelongsToMany(()=>Level,()=>UserLevel)
    declare levels: Level[]
}

export default User;







