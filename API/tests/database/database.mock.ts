import {Sequelize} from "sequelize-typescript";
  
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    models: [__dirname + "/../../src/data/models/*.ts"],
    logging: false
});
sequelize.sync({force: true})
export default sequelize;