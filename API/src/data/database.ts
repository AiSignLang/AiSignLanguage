import {Sequelize} from "sequelize-typescript";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/db.sqlite3',
    models: [__dirname+"/models/*.ts"],
    logging: false
});
export default sequelize;
