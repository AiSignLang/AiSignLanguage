import {Sequelize} from "sequelize-typescript";
  
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    models: [__dirname + "/../../src/data/models/*.ts"],
    logging: false
});
export default sequelize;