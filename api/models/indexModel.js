const { Sequelize} = require('sequelize');
const dbConfig = require('../db.config');

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

module.exports = {
    instance: instance,
    home: require('./homeModel')(instance)
};