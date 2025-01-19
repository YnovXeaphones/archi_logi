import { DataTypes } from 'sequelize';

export default (instance) => {
    return instance.define('port', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        homeid: {
            type: DataTypes.STRING,
        },
        port: {
            type: DataTypes.INTEGER,
        }
    },
    {}
    );
}