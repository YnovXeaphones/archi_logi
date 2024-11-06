const db = require('../models/indexModel');

exports.addPing = (mac) => {
    return db.home.addPing({ mac });
};