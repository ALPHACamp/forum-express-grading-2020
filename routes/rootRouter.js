const express = require('express');
const userController = require('../controllers/userController.js');
const restController = require('../controllers/restController.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.get('/restaurants', restController.getRestaurants);

router
  .route('/signup')
  .get(userController.signUpPage)
  .post(userController.signUp);

module.exports = router;
