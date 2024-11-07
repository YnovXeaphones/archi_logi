import Sequelize from 'sequelize';
import dbConfig from '../db.config.js';

const instance = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'mysql'
    }
);

import home from './homeModel.js';

export default {
    instance: instance,
    home: home.home(instance)
};