import Sequelize from 'sequelize';
import dbConfig from '../db.config.js';
import homeModel from './homeModel.js';
import portModel from './portModel.js';

async function connectWithRetry() {
    let retries = 5;
    let lastError;

    while (retries > 0) {
        try {
            const sequelize = new Sequelize(
                dbConfig.database,
                dbConfig.username,
                dbConfig.password,
                {
                    host: dbConfig.host,
                    port: dbConfig.port,
                    dialect: 'mysql',
                }
            );
            await sequelize.authenticate();
            console.log('Connexion réussie à la base de données');
            return sequelize;
        } catch (error) {
            lastError = error;
            retries -= 1;
            console.error(`Erreur de connexion. Tentatives restantes : ${retries}`);
            if (retries > 0) {
                console.log(`Nouvelle tentative dans 5 secondes...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                throw new Error(`Échec de la connexion après plusieurs tentatives : ${lastError.message}`);
            }
        }
    }
}

export const initializeSequelize = async () => {
    try {
        const instance = await connectWithRetry();
        const home = homeModel(instance);
        const port = portModel(instance);
        return { instance, home, port };
    } catch (error) {
        console.error('Échec de la connexion:', error.message);
        process.exit(1);
    }
};

// Appel de la fonction pour obtenir les instances
const { instance, home } = await initializeSequelize();

// Exportation de l'instance et du modèle
export { instance, home, port };
