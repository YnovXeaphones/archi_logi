import { addPing, addHome } from '../services/homeService.js';

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

export const register = async (req, res) => {
    try {
        const { mac, sshkey } = req.body;

        if (!mac || !sshkey) {
            return res.status(400).json({ message: 'Erreur : "mac" et "sshkey" sont requis dans le corps de la requête.' });
        }

        const register = await addHome(mac, sshkey);
        if (register.code === 200) {
            res.status(200).json({ message: "Enregistrement réussi", created_at: register.message });
        } else {
            res.status(register.code).json({ message: 'Erreur serveur lors de l\'enregistrement', error: register.message });
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export default { ping, register };