import User from '../../src/data/models/User';
import Score from '../../src/data/models/Score';

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
        const user = await User.create({userName: 'TestUser'});
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
        expect(user.profilePic).toBe('Default_pfp.jpg');
    });
    it('should not exist an user with the same name', () => {
            try {
                User.create({userName: 'TestUser'});
                User.create({userName: 'TestUser'});
            }
            catch (e) {
                expect(e).toBeTruthy();
            }
    });
});