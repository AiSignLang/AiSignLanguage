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
    UpdatedAt, DataType, BelongsToMany, ForeignKey
} from "sequelize-typescript";
import {BelongsToManyAddAssociationMixin} from 'sequelize';
import Score from "./Score";
import Friendship from "./Friendship";
import Level from "./Level";
import UserLevel from "./UserLevel";
import {ValidationFailed} from "sequelize-typescript/dist/browser";
import {isEnum, isString} from "../../Utils";
import Mistake from "./Mistake";
import User from "./User";
import {OAuthProvider} from "../../routes/auth/model";

@Table({
    timestamps: true,
    tableName: 'oauth_accounts',
    modelName: 'OAuthAccount'
})
class OAuthAccount extends Model {
    @IsUUID(4)
    @PrimaryKey
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare userId: string;
    
    @Column({
        type: DataType.ENUM(...Object.values(OAuthProvider)),
        allowNull: false,
        validate: {
            isEnum: (value: any) => isEnum(value, OAuthProvider)
        }
    })
    declare oAuthProvider: OAuthProvider;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isString: isString
        }
    })
    declare oAuthId: string;
    
    @BelongsTo(() => User, 'userId')
    declare user: User;
}
export default OAuthAccount;