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
import { BelongsToManyAddAssociationMixin } from 'sequelize';
import Score from "./Score";
import Friendship from "./Friendship";
import Level from "./Level";
import UserLevel from "./UserLevel";
import {ValidationFailed} from "sequelize-typescript/dist/browser";
import {getAvatarPath, isString} from "../../Utils";
import Mistake from "./Mistake";
import config from "../../config";
import fsSync from "fs";


@Table({
    timestamps: true,
    tableName: 'users',
    modelName: 'User'
})
class User extends Model {
    
    hasProfilePic(): boolean {
        return fsSync.existsSync(getAvatarPath(this.userName));
    }
    
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
        defaultValue: `${config.externalAddress}${config.staticEndpoint}/default_pfp.webp`
    })
    declare profilePic: string;
    
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare userId: string;
    
    @HasMany(()=>Mistake,'userId')
    declare mistakes: Mistake[];
    
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







