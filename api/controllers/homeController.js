import addPing from '../services/homeService.js';

export const ping = async (req, res) => {
    const ping = addPing(req.body.mac);
    if(ping) {
        res.status(201).json(ping);
    } else {
        res.status(400).json({ message: 'Error adding ping' });
    }
};

export default {
    ping
};