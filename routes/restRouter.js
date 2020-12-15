const express = require('express');
const restController = require('../controllers/restController.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.get('/restaurants', restController.getRestaurants);

module.exports = router;