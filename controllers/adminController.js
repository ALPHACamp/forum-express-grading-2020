const fs = require('fs');
const db = require('../models');
const Restaurant = db.Restaurant;

const adminController = {
  getAdmin: (req, res) => {
    return res.redirect('/admin/restaurants');
  },
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        // include: [Category],
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
        await fs.readFile(file.path, async (err, data) => {
          try {
            if (err) return console.log('Error: ', err);
            await fs.writeFile(
              `upload/${file.originalname}`,
              data,
              async () => {
                await Restaurant.create({
                  name: req.body.name,
                  tel: req.body.tel,
                  address: req.body.address,
                  opening_hours: req.body.opening_hours,
                  description: req.body.description,
                  image: file ? `/upload/${file.originalname}` : null,
                });
                req.flash(
                  'success_messages',
                  'restaurant was successfully created'
                );
                return res.redirect('/admin/restaurants');
              }
            );
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
      const restaurant = await Restaurant.findByPk(
        req.params.id
        // , { include: [Category] }
      );
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
        await fs.readFile(file.path, async (err, data) => {
          try {
            if (err) return console.log('Error: ', err);
            await fs.writeFile(
              `upload/${file.originalname}`,
              data,
              async () => {
                const restaurant = await Restaurant.findByPk(req.params.id);
                restaurant.update({
                  name: req.body.name,
                  tel: req.body.tel,
                  address: req.body.address,
                  opening_hours: req.body.opening_hours,
                  description: req.body.description,
                  image: file
                    ? `/upload/${file.originalname}`
                    : restaurant.image,
                });
                req.flash(
                  'success_messages',
                  'restaurant was successfully to update'
                );
                return res.redirect('/admin/restaurants');
              }
            );
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
