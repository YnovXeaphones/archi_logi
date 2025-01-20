const fs = require('fs');
const mqtt = require('mqtt');
const Redis = require('ioredis');  // Utilisation de ioredis pour Redis

const {InfluxDB, Point} = require('@influxdata/influxdb-client');
const {HealthAPI} = require('@influxdata/influxdb-client-apis');

require('dotenv').config(); // Charger les variables d'environnement

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://mqtt:1884';
const MQTT_USERNAME = process.env.MQTT_USERNAME || '';
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || '';
const MQTT_QOS = parseInt(process.env.MQTT_QOS, 10) || 0;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';  // Adresse de Redis
const REDIS_PORT = process.env.REDIS_PORT || 6379;  // Port Redis
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'mypassword';
const ORG = 'docs'
let BUCKET = 'home';
if (fs.existsSync('./bucket.txt')) {
    BUCKET = fs.readFileSync('./bucket.txt', 'utf8').trim();
}

const options = {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
};

const url = 'http://influxdb.g1.south-squad.io:8086';
const token = "super-token-admin";

// Connexion à Redis
const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password : REDIS_PASSWORD
});


redis.on('connect', () => {
    console.log('Connected to Redis.');
});
  
redis.on('error', (err) => {
    console.error('Redis error: ', err);
});

async function connectMQTT() {
    client = mqtt.connect(MQTT_BROKER_URL, options);

    client.on('connect', () => {
        console.log(`Connected to MQTT broker at ${MQTT_BROKER_URL}`);
        
        // Subscribe aux topics
        client.subscribe('sensors/temperature', { qos: MQTT_QOS });
        client.subscribe('sensors/humidity', { qos: MQTT_QOS });
        client.subscribe('sensors/luminosity', { qos: MQTT_QOS });
        client.subscribe('sensors/pressure', { qos: MQTT_QOS });
        client.subscribe('sensors/air_quality', { qos: MQTT_QOS });
    });

    client.on('error', (error) => {
        console.error(`Connection error: ${error.message}. Retrying...`);
        setTimeout(connectMQTT, 5000);  // Retry after 5 seconds
    });

    let redis_have_data = false;

    client.on('message', async (topic, message) => {
        let mac = '';
        let value = '';
        let timestamp = '';

        try {
            const parsedMessage = JSON.parse(message.toString());

            mac = parsedMessage.mac;
            value = parsedMessage.value;
            timestamp = parsedMessage.timestamp;

        } catch (error) {
            console.error('Error parsing message:', error);
        };

        try {
            const influxDataBase = new InfluxDB({ url, token });
            const healthApi = new HealthAPI(influxDataBase);

            const health = await healthApi.getHealth();
            if (health && health.status === 'pass') {
                const writeApi = influxDataBase.getWriteApi(ORG, BUCKET);

                // console.log("influxdb creer data")
                const data = new Point(topic)
                    .tag('sensor_id', mac)
                    .floatField('value', value)
                //console.log(` ${data}`)

                writeApi.writePoint(data)

                console.log(redis_have_data+ ' <==================================');

                if(redis_have_data == true){
                    console.log(redis_have_data+ ' <---------------------------------');
                    transferDataFromRedisToInfluxDB()
                    console.log('Recupération terminer');
                    redis_have_data = false;
                }

                writeApi.close().then(() => {
                    // console.log('WRITE FINISHED')
                });
            } else {
                console.error("Failed to connect to influxDB. Failing back to redis. 1");
                redis_have_data = true;
                redis.set(`mqtt:data:${timestamp}`, JSON.stringify({
                    topic: topic,
                    value: value,
                    timestamp: timestamp,
                    mac: mac
                }));
            }
        } catch (error) {
            console.error("Failed to connect to influxDB. Failing back to redis. 2");
            redis_have_data = true;
            redis.set(`mqtt:data:${timestamp}`, JSON.stringify({
                topic: topic,
                value: value,
                timestamp: timestamp,
                mac: mac
            }));
        };
    });
}

async function transferDataFromRedisToInfluxDB() {
    redis.keys('mqtt:data:*', async (err, keys) => {
        if (err) {
            console.error('Erreur lors de la récupération des clés Redis:', err);
            return;
        }
        if (keys.length === 0) {
            console.log('Aucune donnée à transférer depuis Redis.');
            return;
        }

        const influxDataBase = new InfluxDB({ url, token });
        
        for (const key of keys) {
            redis.get(key, async (err, data) => {
                if (err) {
                    console.error(`Erreur lors de la récupération des données pour la clé ${key}:`, err);
                    return;
                }
                try {
                    const parsedData = JSON.parse(data);
                    const writeApi = influxDataBase.getWriteApi(ORG, BUCKET);

                    const point = new Point(parsedData.topic)
                        .tag('sensor_id', parsedData.mac)
                        .floatField('value', parsedData.value);

                    writeApi.writePoint(point);
                    await writeApi.close();
                    console.log(`Données transférées pour la clé ${key} vers InfluxDB.`);
                    // Supprimer la clé Redis après transfert
                    redis.del(key, (err) => {
                        if (err) {
                            console.error(`Erreur lors de la suppression de la clé ${key}:`, err);
                        } else {
                            console.log(`Clé ${key} supprimée de Redis.`);
                        }
                    });
                } catch (err) {
                    console.error(`Erreur lors du traitement des données pour la clé ${key}:`, err);
                }
            });
        }
    });
}

// Fonction pour envoyer les données stockées dans Redis à InfluxDB
// function sendDataToInfluxDB() {
//     redis.keys('mqtt:data:*', (err, keys) => {
//       if (err) {
//         console.error('Error retrieving keys from Redis:', err);
//         return;
//       }
  
//       if (keys.length === 0) {
//         console.log('No data to send to InfluxDB');
//         return;
//       }
  
//       // Récupérer les données stockées dans Redis
//       redis.mget(keys, (err, data) => {
//         if (err) {
//           console.error('Error retrieving data from Redis:', err);
//           return;
//         }
  
//         const points = data.map((item) => {
//           const parsedItem = JSON.parse(item);
//           return {
//             measurement: parsedItem.topic,
//             tags: { mac: parsedItem.mac },
//             fields: { value: parsedItem.value },
//             timestamp: parsedItem.timestamp,
//           };
//         });
  
//         // Envoi des données à InfluxDB
//         writeApi.writeRecords(points).then(() => {
//           console.log('Data written to InfluxDB');
//           // Nettoyer Redis après envoi
//           redis.del(keys);
//           console.log('Redis data cleared');
//         }).catch(err => {
//           console.error('Error writing data to InfluxDB', err);
//         });
//       });
//     });
//   }
  
//   // Vérifier périodiquement si la connexion Wi-Fi est rétablie et envoyer les données stockées
//   setInterval(() => {
//     if (isConnectedToWifi()) {
//       sendDataToInfluxDB();
//     }
//   }, 30000);  // Vérification toutes les 30 secondes

connectMQTT();
