import User from '../../src/data/models/User';
import Score from '../../src/data/models/Score';
import Level from '../../src/data/models/Level';
import Friendship from '../../src/data/models/Friendship';
import Mistake from "../../src/data/models/Mistake";
import Task from "../../src/data/models/Task";

describe('Database relations', () => {
    it('User should have a Score', async () => {
        const user = await User.create({userName: 'TestUser'});
        const score = await Score.create({dailyStreak: 5, allTimeCorrect: 10, perfectlyDone: 2, ownerId: user.userId});
        user.score = score;
        await user.save();

        const retrievedUser = await User.findOne({where: {userName: 'TestUser'}, include: Score});

        expect(retrievedUser).not.toBeNull();
        expect(retrievedUser!.score.dailyStreak).toBe(score.dailyStreak);
        expect(retrievedUser!.score.allTimeCorrect).toBe(score.allTimeCorrect);
        expect(retrievedUser!.score.perfectlyDone).toBe(score.perfectlyDone);
    });

    it('User should have friends', async () => {
        const user1 = await User.create({userName: 'TestUser1'});
        const user2 = await User.create({userName: 'TestUser2'});
        await Friendship.create({userId: user1.userId, friendId: user2.userId});

        const retrievedUser = await User.findOne({where: {userName: 'TestUser1'}, include: User});

        expect(retrievedUser).not.toBeNull();
        expect(retrievedUser!.friends).toBeDefined();
        expect(retrievedUser!.friends[0].userName).toBe('TestUser2');
    });

    it('User should have levels', async () => {
        const user = await User.create({userName: 'TestUser4'});
        const level = await Level.create({levelName: 'Beginner'});
        await user.$add('level', level);

        const retrievedUser = await User.findOne({where: {userName: 'TestUser4'}, include: Level});

        expect(retrievedUser).not.toBeNull();
        expect(retrievedUser!.levels).toBeDefined();
        expect(retrievedUser!.levels.length).toBeGreaterThan(0);
        expect(retrievedUser!.levels[0]).not.toBeNull();
        expect(retrievedUser!.levels[0].levelName).toBe('Beginner');
    });
});

describe('Database relations', () => {
    it('Level should have multiple tasks and each task should have mistakes', async () => {
        const level = await Level.create({levelName: 'Advanced'});
        const task1 = await Task.create({taskName: 'Task1', levelId: level.levelId});
        const task2 = await Task.create({taskName: 'Task2', levelId: level.levelId});

        const mistake1 = await Mistake.create({taskId: task1.taskId});
        const mistake2 = await Mistake.create({taskId: task2.taskId});

        const retrievedLevel = await Level.findOne({
            where: {levelName: 'Advanced'},
            include: [{
                model: Task,
                include: [Mistake]
            }]
        });

        expect(retrievedLevel).not.toBeNull();
        expect(retrievedLevel!.tasks).toBeDefined();
        expect(retrievedLevel!.tasks.length).toBe(2);
        expect(retrievedLevel!.tasks[0].mistakes).toBeDefined();
        expect(retrievedLevel!.tasks[0].mistakes.length).toBe(1);
        expect(retrievedLevel!.tasks[1].mistakes).toBeDefined();
        expect(retrievedLevel!.tasks[1].mistakes.length).toBe(1);
    });
});

describe('User and Mistake models', () => {
    it('should have a one-to-many relationship', async () => {
        // Create a user
        const user = await User.create({userName: 'TestUser3'});

        // Create multiple mistakes associated with the user
        const mistake1 = await Mistake.create({userId: user.userId, /* other fields */});
        const mistake2 = await Mistake.create({userId: user.userId, /* other fields */});

        // Retrieve the user with its associated mistakes
        const retrievedUser = await User.findOne({
            where: {userName: 'TestUser3'},
            include: Mistake
        });

        // Check that the user was retrieved
        expect(retrievedUser).not.toBeNull();

        // Check that the user's mistakes were retrieved
        expect(retrievedUser!.mistakes).toHaveLength(2);
        expect(retrievedUser!.mistakes).toContainEqual(expect.objectContaining({
            userId: user.userId,
            // Check other fields as necessary
        }));
    });
});