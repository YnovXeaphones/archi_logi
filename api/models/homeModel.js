import { DataTypes } from 'sequelize';

export default (instance) => {
    return instance.define('home', {
        id: {
            primaryKey: true,
            autoIncrement: false,
            type: DataTypes.STRING,
        },
        mac: {
            type: DataTypes.STRING,
            allowNull: false
        },
        port: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        last_ping: {
            type: DataTypes.DATE,
            allowNull: true
        },
        datecreated: {
            type: DataTypes.DATE,
            allowNull: false
        },
        sshkey: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false       
    }
    );
}