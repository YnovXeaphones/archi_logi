import db from './models/indexModel.js';
import app from './app.js';

db.instance.sync({force: true}).then( async() => {
    console.log('Database Synced');

    await db.home.create({id: 1, ip: '192.128.1.1', last_ping: new Date(), port: 3001});

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((e) => {
    console.log(e);
});