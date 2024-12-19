import Sequelize from 'sequelize';
import dbConfig from '../db.config.js';
import homeModel from './homeModel.js';
import portModel from './portModel.js';

export const instance = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'mysql'
    }
);

export const home = homeModel(instance);
export const port = portModel(instance);
