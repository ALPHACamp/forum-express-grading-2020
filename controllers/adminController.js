// const fs = require('fs');
const imgur = require('imgur-node-api');
const db = require('../models');
const Restaurant = db.Restaurant;
const User = db.User;
<<<<<<< HEAD
=======
const Category = db.Category;
>>>>>>> A19-test

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const adminController = {
  getRestaurants: (req, res) => {
<<<<<<< HEAD
    return Restaurant.findAll({ raw: true }).then((restaurants) => {
=======
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
    }).then((restaurants) => {
>>>>>>> A19-test
      return res.render('admin/restaurants', { restaurants: restaurants });
    });
  },
  createRestaurant: (req, res) => {
<<<<<<< HEAD
    return res.render('admin/create');
=======
    Category.findAll({
      raw: true,
      nest: true,
    }).then((categories) => {
      return res.render('admin/create', {
        categories: categories,
      });
    });
>>>>>>> A19-test
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }
    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
<<<<<<< HEAD
=======
          CategoryId: req.body.categoryId,
>>>>>>> A19-test
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created');
          return res.redirect('/admin/restaurants');
        });
      });
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
<<<<<<< HEAD
=======
        CategoryId: req.body.categoryId,
>>>>>>> A19-test
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created');
        return res.redirect('/admin/restaurants');
      });
    }
  },
  getRestaurant: (req, res) => {
<<<<<<< HEAD
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render('admin/restaurant', {
          restaurant: restaurant,
=======
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(
      (restaurant) => {
        return res.render('admin/restaurant', {
          restaurant: restaurant.toJSON(),
>>>>>>> A19-test
        });
      }
    );
  },
  editRestaurant: (req, res) => {
<<<<<<< HEAD
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render('admin/create', { restaurant: restaurant });
      }
    );
=======
    Category.findAll({
      raw: true,
      nest: true,
    }).then((categories) => {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        return res.render('admin/create', {
          restaurant: restaurant.toJSON(),
          categories: categories,
        });
      });
    });
>>>>>>> A19-test
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
<<<<<<< HEAD
=======
              CategoryId: req.body.categoryId,
>>>>>>> A19-test
            })
            .then((restaurant) => {
              req.flash(
                'success_messages',
                'restaurant was successfully to update'
              );
              res.redirect('/admin/restaurants');
            });
        });
      });
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
<<<<<<< HEAD
=======
            CategoryId: req.body.categoryId,
>>>>>>> A19-test
          })
          .then((restaurant) => {
            req.flash(
              'success_messages',
              'restaurant was successfully to update'
            );
            res.redirect('/admin/restaurants');
          });
      });
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then((restaurant) => {
        res.redirect('/admin/restaurants');
      });
    });
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render('admin/users', { users: users });
    });
  },
  putUsers: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      let toggleAdmin = user.isAdmin === false ? true : false;
      user
        .update({
          isAdmin: toggleAdmin,
        })
        .then((user) => {
          req.flash('success_messages', 'user was successfully to update');
          res.redirect('/admin/users');
        });
    });
  },
};

module.exports = adminController;
