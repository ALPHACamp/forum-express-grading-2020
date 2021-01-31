const db = require('../models');

const { Restaurant } = db;

const adminController = {
  // Create
  createRestaurant: (req, res) => res.render('admin/create'),
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description,
    })
      .then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created');
        res.redirect('/admin/restaurants');
      });
  },

  // Read
  getRestaurants: (req, res) => Restaurant.findAll({ raw: true }).then((restaurants) => res.render('admin/restaurants', { restaurants })),
  getRestaurant: (req, res) => Restaurant.findByPk(req.params.id, { raw: true }).then((restaurant) => res.render('admin/restaurant', { restaurant })),

  // Update
  editRestaurant: (req, res) => Restaurant.findByPk(req.params.id, { raw: true }).then((restaurant) => res.render('admin/create', { restaurant })),

};

module.exports = adminController;
