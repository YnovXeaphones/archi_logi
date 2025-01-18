import  {instance, port, home} from './models/indexModel.js';
import app from './app.js';

instance.sync({force: true}).then( async() => {
    console.log('Database Synced');

<<<<<<< HEAD
=======
    let i = setInterval(() => {
        port.findAll()
        .then((ports) => {
            for (let currentPort of ports) {
                if (currentPort.homeid == null) {
                    continue;
                }
    
                let currentHome = home.findOne({ where: { id: currentPort.homeid } });
                if (!currentHome) {
                    port.destroy({ where: { id: currentPort.id } });
                }
    
                if (currentHome.last_ping != null) {
                    let date = new Date();
                    let diff = date.getTime() - currentHome.last_ping.getTime();
                    if (diff > 60000 * 5) {
                        port.destroy({ where: { id: currentPort.id } });
                    }
                } else {
                    port.destroy({ where: { id: currentPort.id } });
                }
            }
        })
    }, 60000 * 5);
    
>>>>>>> origin/dev
    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((e) => {
    console.log(e);
});