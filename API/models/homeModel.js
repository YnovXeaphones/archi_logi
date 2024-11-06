const { DataTypes } = require('sequelize');

module.exports = (instance) => {
    return instance.define('home', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_ping: {
            type: DataTypes.DATE,
            allowNull: false
        },
        port: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false       
    }
    );
};