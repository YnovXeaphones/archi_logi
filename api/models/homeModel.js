import { DataTypes } from 'sequelize';

export default (instance) => {
    return instance.define('home', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        mac: {
            type: DataTypes.STRING,
            allowNull: false
        },
        port: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        last_ping: {
            type: DataTypes.DATE,
            allowNull: false
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