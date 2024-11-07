import { home } from '../models/indexModel.js';

const addPing = async (mac) => {
    try {
        return await home.addPing(mac); // Si addPing est une fonction asynchrone
    } catch (error) {
        console.error('Erreur lors de l\'ajout du ping:', error);
        throw error;
    }
};

export default {
    addPing: addPing
};
