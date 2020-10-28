const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = Restaurant.findAll({ raw: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      console.error(err)
    }
    return res.render('admin/restaurants')
  }
}

module.exports = adminController