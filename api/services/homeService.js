import { home } from '../models/indexModel.js';

export const addPing = async (mac) => {
    try {

        const date = new Date();

        await home.update({ last_ping: date }, { where: { mac: mac } });
        console.log('Ping ajouté pour:', mac);
        return date;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du ping:', error);
        throw error;
    }
};