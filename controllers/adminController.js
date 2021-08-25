const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, nest: true })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if(!req.body.name) {
      req.flash('error_messages', '請輸入餐廳名稱')
      return res.redirect('back')
    }
    const {name, tel, address, opening_hours, description } = req.body
    return Restaurant.create({
      name, tel, address, opening_hours, description
    })
    .then(restaurant => {
      req.flash('success_messages', '餐廳建立成功')
      res.redirect('/admin/restaurants')
    })
  }




}

module.exports = adminController