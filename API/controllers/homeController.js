exports.addPing = async (req, res, next) => {
    const ping = homeService.addPing(req.body.mac);
    if(ping) {
        res.status(201).json(ping);
    } else {
        res.status(400).json({ message: 'Error adding ping' });
    }
};