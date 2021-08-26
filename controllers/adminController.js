const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    // 自動導到views文件夾，找到admin文件的restaurants.handlebars
    Restaurant.findAll({ raw: true, nest: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name) {
      req.flash('warning_messages', "不存在空白的餐廳名稱!")
      return res.redirect('back')
    }

    return Restaurant.create({ name, tel, address, opening_hours, description })
      .then(() => {
        req.flash('success_msg', '成功新增餐廳!')
        res.redirect('/admin/restaurants')
      })
  },

  readRestaurant: (req, res) => {
    const id = req.params.id
    Restaurant.findByPk(id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },

  editRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })
  },

  putRestaurant: (req, res) => {
    const id = req.params.id
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('warning_msg', '請填寫餐廳名稱!')
      return res.rediect('back')
    }

    return Restaurant.findByPk(id)
      .then(restaurant => {
        restaurant.update({
          name, tel, address, opening_hours, description
        })
      })
      .then(restaurant => {
        req.flash('success_msg', '餐廳資訊已成功修改!')
        res.redirect('/admin/restaurants')
      })
  }
}

module.exports = adminController