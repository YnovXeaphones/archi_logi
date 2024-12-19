import { home } from '../models/indexModel.js';
import { v4 as uuidv4 } from 'uuid';
import Sequelize from 'sequelize';


export const addPing = async (mac) => {
    try {
        const date = new Date();

        let update = await home.update({ last_ping: date }, { where: { mac: mac } });
        if (update[0] === 0) {
            console.error('Erreur lors de la mise à jour du last_ping: Mac address non trouvé');
            return { code: 404, message: 'Adresse MAC non trouvé' };
        }

        return  { code: 200, message: date };
    } catch (error) {
        console.error('Erreur lors de l\'ajout du ping:', error);
        throw error;
    }
};

export const addHome = async (mac, sshkey) => {
    try {
        const date = new Date();

        let exist = await home.findOne({ where: { mac: mac } });

        if (!exist) {
            let create = await home.create({id: uuidv4(), mac: mac, last_ping: null, port: null, datecreated: date, sshkey: sshkey });

            if (!create) {
                console.error('Erreur lors de la création de la maison');
                return { code: 500, message: 'Erreur lors de la création de la maison' };
            }

            let response = await fetch('http://localhost:7880', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sshkey: sshkey })
            });

            if (!response.ok) {
                console.error('Erreur lors de l\'ajout de la clé SSH');
                return { code: 500, message: 'Erreur lors de l\'ajout de la clé SSH' };
            }
        } 
        
        return { code: 200, message: date };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la maison:', error);
        throw error;
    }
};

export const getActiveDevices = async () => {
    try {
        const now = new Date();
        const threshold = new Date(now.getTime() - 5 * 60 * 1000); // Dernier ping dans les 5 minutes

        // Conversion de la date au format acceptable pour SQL
        const formattedThreshold = threshold.toISOString().slice(0, 19).replace('T', ' ');

        // Requête pour récupérer les appareils actifs
        const activeDevices = await home.findAll({
            where: Sequelize.literal(`last_ping > '${formattedThreshold}'`), // Utilise une condition SQL brute
            attributes: ['id', 'mac', 'port','last_ping','datecreated', 'sshkey', ], // Adapter selon les colonnes de ta table
        });

        return activeDevices;
    } catch (error) {
        console.error('Erreur lors de la récupération des appareils actifs:', error);
        throw new Error('Erreur serveur lors de la récupération des appareils actifs.');
    }
};