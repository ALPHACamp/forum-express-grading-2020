const db = require('../models/index')
const Restaurant = db.Restaurant
const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  }
}

module.exports = adminController