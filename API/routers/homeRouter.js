const express = require('express'),
router = express.Router(),
homeController = require('../controllers/homeController.js');

router.post('/', homeController.addPing);

module.exports = router;