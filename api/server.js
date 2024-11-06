const db = require('../models/indexModel');
const main = require('./app');

db.intance.sync({force: true}).then( async() => {
    console.log('Database Synced');
    await db.home.create({id: 1, ip: '192.128.1.1', last_ping: new Date(), port: 3001});

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((e) => {
    console.log(e);
});