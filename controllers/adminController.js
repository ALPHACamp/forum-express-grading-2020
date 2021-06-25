const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category], //在restaurants中一併帶入關聯資料內容，可用this.Category取出
      order: [['id', 'DESC']]
    })
      .then((restaurants) => {
        if (restaurants.length) return res.render('admin/restaurants', { restaurants })
        req.flash('err_msg', '目前無餐廳資料')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  createRestaurant: (req, res, next) => {
    Category.findAll({ raw: true, nest: true })
      .then((categories) => {
        if (!categories.length) {
          req.flash('err_msg', '請先加入餐廳分類資料')
          return res.redirect('/admin/restaurants')
        }
        return res.render('admin/create', { categories })
      })
      .catch(err => next(err))
  },

  postRestaurant: (req, res, next) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        req.body.image = file ? img.data.link : null
        return Restaurant.create(req.body)
          .then(() => {
            req.flash('success_msg', '餐廳已建立成功')
            return res.redirect('/admin/restaurants')
          })
          .catch(err => next(err))
      })
    }
    else {
      req.body.image = null
      return Restaurant.create(req.body)
        .then(() => {
          req.flash('success_msg', '餐廳已建立成功')
          return res.redirect('/admin/restaurants')
        })
        .catch(err => next(err))
    }
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { include: [Category] })
      .then((restaurant) => {
        if (!restaurant) {
          req.flash('err_msg', '查無該餐廳資料')
          return res.redirect('/admin/restaurants')
        }
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (!categories.length) {
          req.flash('err_msg', '請先加入餐廳分類資料')
          return res.redirect('/admin/restaurants')
        }
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            if (!restaurant) {
              req.flash('err_msg', '查無該餐廳資料')
              return res.redirect('/admin/restaurants')
            }
            return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
          })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填入餐廳名稱')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            if (!restaurant) {
              req.flash('err_msg', '查無該餐廳資料')
              return res.redirect('/admin/restaurants')
            }
            req.body.image = file ? img.data.link : null
            return restaurant.update(req.body)
              .then(() => {
                req.flash('success_msg', '資料更新成功')
                return res.redirect('/admin/restaurants')
              })
          })
          .catch(err => next(err))
      })
    }
    else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          if (!restaurant) {
            req.flash('err_msg', '查無該餐廳資料')
            return res.redirect('/admin/restaurants')
          }
          return restaurant.update(req.body)
            .then(() => {
              req.flash('success_msg', '資料更新成功')
              return res.redirect('/admin/restaurants')
            })
        })
        .catch(err => next(err))
    }
  },

  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        if (!restaurant) {
          req.flash('err_msg', '查無該餐廳資料')
          return res.redirect('/admin/restaurants')
        }
        return restaurant.destroy()
          .then(() => {
            req.flash('success_msg', '餐廳已成功移除')
            return res.redirect('/admin/restaurants')
          })
      })
      .catch(err => next(err))
  },

  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then((users) => {
        if (users.length) return res.render('admin/users', { users })
        req.flash('err_msg', '目前無使用者資料')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  },

  toggleAdmin: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          req.flash('err_msg', '查無該使用者資料')
          return res.redirect('/admin/users')
        }
        return user.update({ isAdmin: !(user.isAdmin) })
          .then(() => {
            req.flash('success_msg', '使用者權限已更改成功')
            return res.redirect('/admin/users')
          })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController