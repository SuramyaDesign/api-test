import { Sequelize, DataTypes, Model } from 'sequelize';
import mariadb from 'mariadb';

const DB_NAME = process.env.dbName
const DB_USER = process.env.dbUser
const DB_PASSWORD = process.env.dbPass
const DB_HOST = process.env.dbHost
var sequelize


try {
    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST, 
        dialect: 'mariadb', 
        dialectModule: mariadb,
        logging: false, 
        pool: {
            max: 15,
            min: 0,
            acquire: 60000,
            idle: 10000
        }
    });

    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
}
catch (err) {
    console.log(err)
}


module.exports = { sequelize, DataTypes, Model }