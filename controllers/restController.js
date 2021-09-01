const db = require('../models/index')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category })
      .then(restaurants => {
        const data = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.description.substring(0, 50),
          categoryName: restaurant.Category.name
        }))
        return res.render('restaurants', { restaurants: data })
      })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
  }
}

module.exports = restController
