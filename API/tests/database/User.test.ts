import User from '../../src/data/models/User';
import Score from '../../src/data/models/Score';
import sequelize from "./database.mock";

beforeAll(async () => {
    await User.destroy({where: {}});
    await sequelize.sync({force: true});
});
describe('User model', () => {
    

    it('should validate userName', async () => {
        expect.assertions(1);
        try {
            await User.create({userName: ''}); // Versuchen Sie, einen Benutzer mit einem leeren Namen zu erstellen
        } catch (e) {
            expect(e).toBeTruthy(); // Es sollte einen Fehler geben
        }
    });
    it('should have a score', async () => {
        let user;
        user = await User.findOne({where: {userName: 'TestUser'}});
        if (user === null) {
            user = await User.create({userName: 'TestUser'});
        }
        expect(user).toBeDefined();
        
        const score = await Score.create({dailyStreak: 5, allTimeCorrect: 10, perfectlyDone: 2, ownerId: user.userId});
        user.score = score;
        await user.save()
        await score.save();
        const retrievedUser = await User.findOne({where: {userName: 'TestUser'}, include: Score});

        expect(retrievedUser).not.toBeNull();
        expect(retrievedUser!.score.dailyStreak).toBe(score.dailyStreak);
        expect(retrievedUser!.score.allTimeCorrect).toBe(score.allTimeCorrect);
        expect(retrievedUser!.score.perfectlyDone).toBe(score.perfectlyDone);
    });
    
    it('should have a default profile picture', async () => {
        const user = await User.create({userName: 'TestUser2'});
        expect(user.profilePic).toContain('default_pfp.webp');
    });
    it('should not exist an user with the same name',  async () => {
            try {
                await User.create({userName: 'TestUser'});
                await User.create({userName: 'TestUser'});
            }
            catch (e) {
                expect(e).toBeTruthy();
            }
    });
});