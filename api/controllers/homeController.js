import { addPing } from '../services/homeService.js';

export const ping = async (req, res) => {
    try {
        const { mac } = req.body;

        if (!mac) {
            return res.status(400).json({ message: 'Erreur : "mac" est requis dans le corps de la requête.' });
        }

        const ping = await addPing(mac);
        if (ping.code === 200) {
            res.status(200).json({ message: "Ping reçu et last_ping mis à jour", updated_at: ping.message });
        } else {
            res.status(ping.code).json({ message: 'Erreur serveur lors de la mise à jour du last_ping', error: ping.message });
        }
    } catch (error) {
        console.error('Erreur de mise à jour du last_ping:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export default {
    ping
};
