const express = require('express');
const adminController = require('../controllers/adminController.js');

const router = express.Router();

router.route('/').get(adminController.getAdmin);

router
  .route('/restaurants')
  .get(adminController.getRestaurants)
  .post(adminController.postRestaurant);

router
  .route('/restaurants/:id')
  .get(adminController.getRestaurant)
  .put(adminController.putRestaurant);

router.route('/restaurants/:id/edit').get(adminController.editRestaurant);

router.route('/restaurants/create').get(adminController.createRestaurant);

module.exports = router;
