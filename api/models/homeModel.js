import { DataTypes } from 'sequelize';

export default (instance) => {
    return instance.define('home', {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull: false
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
}