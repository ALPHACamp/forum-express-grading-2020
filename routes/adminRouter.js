const express = require('express');
const adminController = require('../controllers/adminController.js');
const categoryController = require('../controllers/categoryController.js');

const multer = require('multer');
const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.route('/').get(adminController.getAdmin);

router
  .route('/categories')
  .get(categoryController.getCategories)
  .post(categoryController.postCategory);

router
  .route('/categories/:id')
  .get(categoryController.getCategories)
  .put(categoryController.putCategory)
  .delete(categoryController.deleteCategory);

router.route('/users').get(adminController.getUsers);
router.route('/users/:id/toggleAdmin').put(adminController.toggleAdmin);

router.route('/restaurants/create').get(adminController.createRestaurant);
router
  .route('/restaurants')
  .get(adminController.getRestaurants)
  .post(upload.single('image'), adminController.postRestaurant);

router
  .route('/restaurants/:id')
  .get(adminController.getRestaurant)
  .put(upload.single('image'), adminController.putRestaurant)
  .delete(adminController.deleteRestaurant);

router.route('/restaurants/:id/edit').get(adminController.editRestaurant);

module.exports = router;
