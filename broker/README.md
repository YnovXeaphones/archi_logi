
# IoT MQTT Simulator with Docker and Mosquitto

This project simulates IoT sensor data and publishes it to an MQTT broker (Mosquitto) in a Dockerized environment. This setup is useful for testing IoT applications that consume sensor data through MQTT.

## Project Structure

- `main.js`: Node.js script to simulate sensor data and publish to an MQTT broker.
- `Dockerfile`: Dockerfile for building the Node.js simulator image.
- `docker-compose.yml`: Defines the Docker services (simulator and MQTT broker).
- `.env.example`: Example environment file for configuring the MQTT settings and sensor simulation parameters.
- `mosquitto.conf`: Mosquitto configuration file for enabling MQTT authentication and WebSocket support.
- `mosquitto_passwd`: File containing the MQTT broker credentials (generated via `mosquitto_passwd`).

## Requirements

- Docker and Docker Compose
- Mosquitto client (for generating `mosquitto_passwd` file)

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
    ```bash
    cp .env.example .env
    ```
2. Modify `.env` with the appropriate values for MQTT broker, frequency, and other settings.

### 3. Configure Mosquitto Password

1. Install the Mosquitto client tools if not already installed.
   - **Ubuntu/Debian**:
     ```bash
     sudo apt-get install -y mosquitto-clients
     ```
   - **macOS**:
     ```bash
     brew install mosquitto
     ```
2. Generate the password file:
   ```bash
   mosquitto_passwd -c mosquitto_passwd your_username
   ```
   Replace `your_username` with your desired username. You will be prompted to set a password.

### 4. Build and Start the Containers

Run the following command to build and start the services:

```bash
docker-compose up --build
```

This will start:
- `mqtt`: The Mosquitto MQTT broker
- `simulator`: The Node.js simulator for publishing sensor data to MQTT

### 5. Testing the Setup

To test the MQTT broker, you can use the Mosquitto client to subscribe to the `sensors/#` topic and observe the messages.

```bash
docker run --rm --name mqtt --network sensor-simulation_default eclipse-mosquitto mosquitto_sub -h mosquitto -p 1884 -t 'sensors/#' -u your_username -P your_password
```

You should see sensor data being published by the simulator.

## Docker Compose Configuration

The `docker-compose.yml` file defines two services:

- **`mqtt`**: Mosquitto broker with authentication and WebSocket support.
- **`simulator`**: Node.js application that simulates sensor data and publishes it to the MQTT broker.

### Mosquitto Configuration (`mosquitto.conf`)

The Mosquitto configuration file defines the following settings:
- Default MQTT listener on port `1884`
- Authentication with `mosquitto_passwd` file
- Persistence enabled for data storage

### Environment Variables

The simulator uses the following environment variables (set in `.env`):

- `MQTT_BROKER_URL`: MQTT broker URL (default: `mqtt://localhost:1884`)
- `MQTT_USERNAME`: Username for MQTT broker authentication
- `MQTT_PASSWORD`: Password for MQTT broker authentication
- `DATA_FREQUENCY`: Frequency of sensor data publishing (in milliseconds)
- `SENSOR_COUNT`: Number of sensors to simulate (1-5)
- `MQTT_QOS`: MQTT Quality of Service level (0, 1, or 2)

## Clean Up

To stop and remove the containers and networks created by Docker Compose:

```bash
docker-compose down
```

## Additional Notes

- **Scaling the Simulator**: You can scale the `simulator` service to simulate multiple devices:
  ```bash
  docker-compose up --build --scale simulator=3
  ```
- **Logging**: View logs of both services:
  ```bash
  docker-compose logs -f
  ```

## Troubleshooting

- **Connection Issues**: Verify that `MQTT_BROKER_URL` in `.env` matches the `mqtt` service URL.
- **Authentication Errors**: Confirm the credentials in `.env` match the `mosquitto_passwd` file.
- **Port Conflicts**: Adjust the ports in `docker-compose.yml` if `1884` are in use.

This setup is now ready to simulate IoT data streaming via MQTT for testing purposes.
