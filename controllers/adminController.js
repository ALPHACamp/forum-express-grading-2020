const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true, // restaurants 資料處理
      nest: true // restaurants 資料處理
    }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurnat: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    return Restaurant.create({ name, tel, address, opening_hours, description })
      .then(restaurant => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() }) // restaurant 資料處理
      })
  }
}

module.exports = adminController