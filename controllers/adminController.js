const imgur = require('imgur-node-api');

const { IMGUR_CLIENT_ID } = process.env;
const fs = require('fs');
const db = require('../models');

const { Restaurant, User } = db;

const adminController = {
/* * * * * * * *
* Restaurant  *
* * * * * * * */
  // Create
  createRestaurant: (req, res) => res.render('admin/create'),
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: file ? img.data.link : null,
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created');
        return res.redirect('/admin/restaurants');
      }));
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created');
        return res.redirect('/admin/restaurants');
      });
    }
  },

  // Read
  getRestaurants: (req, res) => Restaurant.findAll({ raw: true }).then((restaurants) => res.render('admin/restaurants', { restaurants })),
  getRestaurant: (req, res) => Restaurant.findByPk(req.params.id, { raw: true }).then((restaurant) => res.render('admin/restaurant', { restaurant })),

  // Update
  editRestaurant: (req, res) => Restaurant.findByPk(req.params.id, { raw: true }).then((restaurant) => res.render('admin/create', { restaurant })),
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update');
              res.redirect('/admin/restaurants');
            });
        }));
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update');
              res.redirect('/admin/restaurants');
            });
        })
        .then((test) => {
          console.log(test);
        });
    }
  },

  // Delete
  deleteRestaurant: (req, res) => Restaurant.findByPk(req.params.id).then((restaurant) => {
    restaurant.destroy()
      .then((restaurant) => {
        res.redirect('/admin/restaurants');
      });
  }),

  /* * * * * *
*  Admin  *
* * * * * */
  // Create
  // Read
  getUsers: (req, res) => User.findAll({ raw: true }).then((users) => res.render('admin/users', { users })),
  // Update
  toggleAdmin: (req, res) => User.findByPk(req.params.id).then((user) => {
    user.update({
      isAdmin: user.isAdmin !== true,
    })
      .then((user) => {
        req.flash('success_messages', 'User was updated successfully');
        res.redirect('/admin/users');
      });
  }),
// Delete
};

module.exports = adminController;
