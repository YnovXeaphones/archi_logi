import addPing from '../services/homeService.js';

export const ping = async (req, res) => {
    const ping = addPing(req.body.mac);
    if(ping) {
        res.status(200).json({ message: "Ping reçu et last_ping mis à jour", updated_at: currentTime });
    } else {
        console.error('Erreur de mise à jour du last_ping:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export default {
    ping
};