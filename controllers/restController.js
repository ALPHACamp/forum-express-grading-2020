const db = require('../models');

const { Restaurant } = db;
const { Category } = db;

const restController = {
  getRestaurants: (req, res) => {
    Restaurant
    .findAll({ include: Category })
    .then((restaurants) => {
      const data = restaurants.map((r) => ({
        ...r.dataValues, // spread up restaurant details
        description : r.dataValues.description.substring(0, 50), // override desc with shorter ver
        categoryName: r.Category.name,
      }));

      return res.render('restaurants', {
        restaurants: data,
      });
    });
  },
  getRestaurant: (req, res) => {
    Restaurant
    .findByPk(req.params.id, {
      include: Category,
    })
    .then((restaurant) => res.render('restaurant', {
      restaurant: restaurant.toJSON(),
    }));
  },
};

module.exports = restController;
