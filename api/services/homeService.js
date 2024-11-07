import { home } from '../models/indexModel.js';

export const addPing = async (mac) => {
    try {
        console.log('Ajout du ping pour:', mac);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du ping:', error);
        throw error;
    }
};