const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then((restaurants) => {
      return res.render('admin/restaurants', { res: restaurants })
    })
  }
}

module.exports = adminController
