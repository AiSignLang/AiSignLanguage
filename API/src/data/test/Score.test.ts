import User from "../models/User";
import Score from "../models/Score";

describe('Score model', () => {
    it('should create and retrieve a score', async () => {
        const user = await User.create({userName: 'TestUser3'});
        const createdScore = await Score.create({
            dailyStreak: 5,
            allTimeCorrect: 10,
            perfectlyDone: 2,
            ownerId: user.userId
        });

        const retrievedScore = await Score.findOne({where: {scoreId: createdScore.scoreId}});

        expect(retrievedScore).not.toBeNull();
        expect(retrievedScore!.dailyStreak).toBe(createdScore.dailyStreak);
        expect(retrievedScore!.allTimeCorrect).toBe(createdScore.allTimeCorrect);
        expect(retrievedScore!.perfectlyDone).toBe(createdScore.perfectlyDone);
    });
});