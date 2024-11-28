import  {instance, home} from './models/indexModel.js';
import app from './app.js';

instance.sync({force: true}).then( async() => {
    console.log('Database Synced');

    await home.create({id: 1, mac: 'test', last_ping: new Date(), port: 3001, datecreated: new Date(), sshkey: 'test'});

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((e) => {
    console.log(e);
});