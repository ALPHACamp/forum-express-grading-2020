const express = require('express');
const adminController = require('../controllers/adminController.js');

const router = express.Router();

router.route('/').get(adminController.getAdmin);

router.route('/restaurants').get(adminController.getRestaurants);

module.exports = router;
