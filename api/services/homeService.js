import { home } from '../models/indexModel.js';
import { v4 as uuidv4 } from 'uuid';

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

        let create = await home.create({id: uuidv4(), mac: mac, last_ping: null, port: null, datecreated: date, sshkey: sshkey });
        return { code: 200, message: date };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la maison:', error);
        throw error;
    }
}