import Level from "../../src/data/models/Level";
import Task from "../../src/data/models/Task";
import User from "../../src/data/models/User";
import sequelize from "./database.mock";

beforeAll(async () => {
    await Level.destroy({where: {}});
    await sequelize.sync({force: true});
});
describe('Level model', () => {
    it('should create and retrieve a level', async () => {
        const createdLevel = await Level.create({
            levelName: 'Beginner'
        });

        const retrievedLevel = await Level.findOne({where: {levelId: createdLevel.levelId}});

        expect(retrievedLevel).not.toBeNull();
        expect(retrievedLevel!.levelName).toBe(createdLevel.levelName);
    });

    it('should update a level', async () => {
        const level = await Level.findOne();
        level!.levelName = 'Intermediate';
        await level!.save();

        const updatedLevel = await Level.findOne({where: {levelId: level!.levelId}});

        expect(updatedLevel!.levelName).toBe('Intermediate');
    });

    it('should delete a level', async () => {
        const level = await Level.findOne();
        await level!.destroy();

        const deletedLevel = await Level.findOne({where: {levelId: level!.levelId}});

        expect(deletedLevel).toBeNull();
    });

    it('should not create a level with invalid data', async () => {
        await expect(Level.create({
            levelName: 123 // Passing a number where a string is expected
        })).rejects.toThrow();
    });

    it('should create a level with tasks', async () => {
        const level = await Level.create({
            levelName: 'Advanced'
        });

        const task = await Task.create({
            taskName: 'Task 1',
            levelId: level.levelId
        });

        const retrievedLevel = await Level.findOne({where: {levelId: level.levelId}, include: Task});

        expect(retrievedLevel!.tasks).toBeDefined();
        expect(retrievedLevel!.tasks[0].taskName).toBe(task.taskName);
    });
});