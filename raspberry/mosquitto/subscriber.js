const mqtt = require('mqtt');
const Redis = require('ioredis');  // Utilisation de ioredis pour Redis
require('dotenv').config(); // Charger les variables d'environnement

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://mqtt:1884';
const MQTT_USERNAME = process.env.MQTT_USERNAME || '';
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || '';
const MQTT_QOS = parseInt(process.env.MQTT_QOS, 10) || 0;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';  // Adresse de Redis
const REDIS_PORT = process.env.REDIS_PORT || 6379;  // Port Redis
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'mypassword';


const options = {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
};

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

// let client = mqtt.connect(MQTT_BROKER_URL, options);

function connectMQTT() {
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

    client.on('message', (topic, message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            console.log(`Received data from ${topic}:`);
            console.log(`MAC Address: ${parsedMessage.mac}`);
            console.log(`Value: ${parsedMessage.value}`);
            console.log(`Timestamp: ${parsedMessage.timestamp}`);

            // Storing the data in Redis (using SET to store the latest message)
            redis.set(`mqtt:data:${parsedMessage.timestamp}`, JSON.stringify({
                topic: topic,
                value: parsedMessage.value,
                timestamp: parsedMessage.timestamp,
                mac: parsedMessage.mac
            }));
            
        } catch (error) {
            console.error('Error parsing message:', error);
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
