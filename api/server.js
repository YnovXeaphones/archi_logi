import  {instance, home} from './models/indexModel.js';
import app from './app.js';

instance.sync({force: true}).then( async() => {
    console.log('Database Synced');

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((e) => {
    console.log(e);
});