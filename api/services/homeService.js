import { home } from '../models/indexModel.js';

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