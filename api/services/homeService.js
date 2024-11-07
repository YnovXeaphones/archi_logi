import db from '../models/indexModel.js';

const addPing = (mac) => {
    return db.home.addPing(mac);
};

export default {
    addPing: addPing
}