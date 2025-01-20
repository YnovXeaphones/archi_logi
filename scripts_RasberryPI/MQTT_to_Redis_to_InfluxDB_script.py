import paho.mqtt.client as mqtt
import redis
from influxdb import InfluxDBClient  # Assurez-vous que `influxdb` est installé via le script bash

# Configuration de Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# Configuration de la base de données InfluxDB (TimeSeries DB)
influx_client = InfluxDBClient(host='adresse_ip_ou_nom_de_domaine_du_serveur', port=8086, database='sensors_db')

# Vérifie si la base de données existe, sinon la crée
databases = influx_client.get_list_database()
if not any(db['name'] == 'sensors_db' for db in databases):
    influx_client.create_database('sensors_db')

# Callback lors de la connexion au broker MQTT
def on_connect(client, userdata, flags, rc):
    print(f"Connecté au broker MQTT avec le code {rc}")
    client.subscribe("sensor/topic")

# Callback lors de la réception d'un message MQTT
def on_message(client, userdata, message):
    print(f"Message reçu sur le topic {message.topic}: {message.payload.decode()}")
    
    # Stocker les données dans Redis
    redis_client.set('latest_sensor_data', message.payload)

    # Préparer les données pour InfluxDB
    json_body = [
        {
            "measurement": "sensor_data",
            "tags": {
                "source": "raspberry_pi"
            },
            "fields": {
                "value": float(message.payload.decode())
            }
        }
    ]

    # Envoyer les données à InfluxDB
    influx_client.write_points(json_body)

# Configurer le client MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# Connexion au broker
mqtt_client.connect("localhost", 1883, 60)

# Boucle infinie pour attendre les messages
mqtt_client.loop_forever()
