import Users from "../data/models/User";
import {StatusCodes} from "http-status-codes";
import sequelize from "../data/database";
import Score from "../data/models/Score";
import {ServiceReturn} from "../model";

export async function createUser(name: string):Promise<ServiceReturn<Users>>{
    const user = await Users.findOne({where: {userName: name}}); // TODO: in html action is /api/user/ post, maybe put, but where to get username?
    if (user) {
       return {
           status: StatusCodes.CONFLICT,
           data: null
       };
    }
    const transaction = await sequelize.transaction();
    try {
        const user = await Users.create({userName: name});
        await user.save();
        user.score = await Score.create({dailyStreak: 0, perfectlyDone: 0, allTimeCorrect: 0, ownerId: user.userId});
        await transaction.commit();
        return {
            status: StatusCodes.CREATED,
            data: user
        };
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null
        };
    }
}