const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true })
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
  }
}
module.exports = adminController