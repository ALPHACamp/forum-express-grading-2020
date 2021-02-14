const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        res.render('admin/create', { categories })
      })
  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', '請填寫餐廳名稱。')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({ name, tel, address, opening_hours, description, image: file ? img.data.link : null, CategoryId: req.body.categoryId })
          .then(() => {
            req.flash('success_messages', '餐廳新增成功。')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({ name, tel, address, opening_hours, description, image: null, CategoryId: req.body.categoryId })
        .then(() => {
          req.flash('success_messages', '餐廳新增成功。')
          return res.redirect('/admin/restaurants')
        })
    }
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => res.render('admin/restaurant', { restaurant: restaurant.toJSON() }))
  },
  editRestaurant: (req, res) => {
    return Promise.all([Category.findAll({ raw: true, nest: true }), Restaurant.findByPk(req.params.id, { raw: true })])
      .then(([categories, restaurant]) => res.render('admin/create', { restaurant, categories }))
  },
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', '請填寫餐廳名稱。')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({ name, tel, address, opening_hours, description, image: file ? img.data.link : restaurant.image, CategoryId: req.body.categoryId })
              .then(() => {
                req.flash('success_messages', '餐廳更新成功。')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({ name, tel, address, opening_hours, description, image: restaurant.image, CategoryId: req.body.categoryId })
            .then(() => {
              req.flash('success_messages', '餐廳更新成功。')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(() => res.redirect('/admin/restaurants'))
      })
  },
  getUsers: (req, res) => {
    User.findAll({ raw: true })
      .then(users => {
        if (users.isAdmin) { users.isAdmin = true }
        else { users.isAdmin = false }
        return res.render('admin/users', { users })
      })
  },
  toggleAdmin: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => user.update({ isAdmin: !user.isAdmin }))
      .then(() => res.redirect('/admin/users'))
  }
}

module.exports = adminController
