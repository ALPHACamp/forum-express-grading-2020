const fs = require('fs');
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const db = require('../models');
const Restaurant = db.Restaurant;
const User = db.User;
const Category = db.Category;

const adminController = {
  getAdmin: (req, res) => {
    return res.redirect('/admin/restaurants');
  },

  // user
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true, nest: true });
      return res.render('admin/users', { users });
    } catch (err) {
      console.log(err);
    }
  },

  toggleAdmin: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      let toggle = user.isAdmin === false ? true : false;
      await user.update({ isAdmin: toggle });
      req.flash('success_messages', 'user was successfully to update');
      return res.redirect('/admin/users');
    } catch (err) {
      console.log(err);
    }
  },

  // restaurant
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
      });
      return res.render('admin/restaurants', { restaurants: restaurants });
    } catch (err) {
      console.log(err);
    }
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create');
  },
  postRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist");
        return res.redirect('back');
      }
      const { file } = req;
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        await imgur.upload(file.path, async (err, img) => {
          try {
            await Restaurant.create({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : null,
            });
            req.flash(
              'success_messages',
              'restaurant was successfully created'
            );
            return res.redirect('/admin/restaurants');
          } catch (err) {
            console.log(err);
          }
        });
      }
      await Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
      });
      req.flash('success_messages', 'restaurant was successfully created');
      return res.redirect('/admin/restaurants');
    } catch (err) {
      console.log(err);
    }
  },
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category],
      });
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON(),
      });
    } catch (err) {
      console.log(err);
    }
  },
  editRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      return res.render('admin/create', {
        restaurant: restaurant.toJSON(),
        // categories: categories,
      });
    } catch (err) {
      console.log(err);
    }
  },
  putRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist");
        return res.redirect('back');
      }
      const { file } = req;
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        await imgur.upload(file.path, async (err, img) => {
          try {
            const restaurant = await Restaurant.findByPk(req.params.id);
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
            });
            req.flash(
              'success_messages',
              'restaurant was successfully to update'
            );
            return res.redirect('/admin/restaurants');
          } catch (err) {
            console.log(err);
          }
        });
      }
      const restaurant = await Restaurant.findByPk(req.params.id);
      restaurant.update({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: restaurant.image,
        // CategoryId: req.body.categoryId,
      });
      req.flash('success_messages', 'restaurant was successfully to update');
      return res.redirect('/admin/restaurants');
    } catch (err) {
      console.log(err);
    }
  },
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      restaurant.destroy();
      return res.redirect('/admin/restaurants');
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = adminController;
