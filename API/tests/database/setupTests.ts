import sequelize from './database.mock';
import './database.mock';

beforeAll(async () => {
    await sequelize.sync({force: true});
});
