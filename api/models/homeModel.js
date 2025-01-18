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
        last_ping: {
            type: DataTypes.DATE,
            allowNull: true
        },
        datecreated: {
            type: DataTypes.DATE,
            allowNull: false
        },
        sshkey: {
<<<<<<< HEAD
            type: DataTypes.STRING(2048),
=======
            type: DataTypes.TEXT('long'),
>>>>>>> origin/dev
            allowNull: false
        }
    },
    {
        timestamps: false       
    }
    );
}