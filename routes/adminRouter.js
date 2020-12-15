const express = require('express');
const adminController = require('../controllers/adminController.js');

const router = express.Router();

router.route('/').get(adminController.getAdmin);

router
  .route('/restaurants')
  .get(adminController.getRestaurants)
  .post(adminController.postRestaurant);
router.route('/restaurants/create').get(adminController.createRestaurant);

module.exports = router;
