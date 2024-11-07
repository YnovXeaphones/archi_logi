import { instance, home } from './models/indexModel.js';
import { v4 as uuidv4 }  from "uuid";
import app from './app.js';

instance.sync({force: true}).then( async() => {
    console.log('Database Synced');

    await home.create({id: uuidv4(), ip: '192.128.1.1', last_ping: new Date(), port: 3001});

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((e) => {
    console.log(e);
});