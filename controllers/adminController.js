const db = require('../models');

const { Restaurant } = db;

const adminController = {
  getRestaurants: (req, res) => Restaurant.findAll({ raw: true }).then((restaurants) => res.render('admin/restaurants', { restaurants })),

  createRestaurant: (req, res) => res.render('admin/create'),
};

module.exports = adminController;
