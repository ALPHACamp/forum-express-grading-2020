const fs = require('fs')

const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService.js')

// -----------------------------------------------------------------------------------

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },


  // -----------------------------------------------------------------------------------

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      console.log(categories)
      return res.render('admin/create', {
        categories: categories
      })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  // -----------------------------------------------------------------------------------

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  // -----------------------------------------------------------------------------------

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
    })
  },

  // -----------------------------------------------------------------------------------

  // 我們其實只有改一點而已，在使用者上傳檔案之後會呼叫 imgur 的 API，把圖片直接從暫存資料夾上傳上去，成功以後 http://img.data.link/ 會是剛剛上傳後拿到的圖片網址，再把這個網址放到資料庫裡

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  // -----------------------------------------------------------------------------------

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  // -----------------------------------------------------------------------------------

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', {
        users: users
      })
    })
  },

  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        const isAdmin = !user.isAdmin
        user.update({ isAdmin })
          .then(() => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect('/admin/users')
          })
      })
  }

}

// -----------------------------------------------------------------------------------

module.exports = adminController