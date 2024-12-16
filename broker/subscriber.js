const mqtt = require('mqtt');
require('dotenv').config(); // Charger les variables d'environnement

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://mqtt:1884';
const MQTT_USERNAME = process.env.MQTT_USERNAME || '';
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || '';
const MQTT_QOS = parseInt(process.env.MQTT_QOS, 10) || 0;

const options = {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
};

let client = mqtt.connect(MQTT_BROKER_URL, options);

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
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
}

connectMQTT();
