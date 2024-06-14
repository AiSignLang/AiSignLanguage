import Score from "../../src/data/models/Score";
import User from "../../src/data/models/User";
import sequelize from "./database.mock";

beforeAll(async () => {
    await User.destroy({where: {}});
    await Score.destroy({where: {}});
    await sequelize.sync({force: true});
});
describe('Score model', () => {
    let user;
    beforeAll(async () => {
        user = await User.create({userName: 'TestUser'});
        expect(user).toBeDefined();
    });

    it('should create and retrieve a score', async () => {
        const createdScore = await Score.create({
            dailyStreak: 5,
            allTimeCorrect: 10,
            perfectlyDone: 2,
            ownerId: user!.userId
        });

        const retrievedScore = await Score.findOne({where: {scoreId: createdScore.scoreId}});

        expect(retrievedScore).not.toBeNull();
        expect(retrievedScore!.dailyStreak).toBe(createdScore.dailyStreak);
        expect(retrievedScore!.allTimeCorrect).toBe(createdScore.allTimeCorrect);
        expect(retrievedScore!.perfectlyDone).toBe(createdScore.perfectlyDone);
    });

    it('should update a score', async () => {
        const score = await Score.findOne({where: {ownerId: user!.userId}});
        score!.dailyStreak = 6;
        await score!.save();

        const updatedScore = await Score.findOne({where: {scoreId: score!.scoreId}});

        expect(updatedScore!.dailyStreak).toBe(6);
    });

    it('should delete a score', async () => {
        const score = await Score.findOne({where: {ownerId: user!.userId}});
        await score!.destroy();

        const deletedScore = await Score.findOne({where: {scoreId: score!.scoreId}});

        expect(deletedScore).toBeNull();
    });

    it('should not create a score with invalid data', async () => {
        await expect(Score.create<Score>({
            dailyStreak: 'invalid',
            allTimeCorrect: 10,
            perfectlyDone: 2,
            ownerId: user!.userId
        })).rejects.toThrow();
    });
});