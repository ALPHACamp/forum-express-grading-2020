const db = require('../models/index')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => res.render('admin/create', { categories }))
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => res.render('admin/create', {
            categories,
            restaurant: restaurant.toJSON()
          }))
      })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error: ', err)
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  },

  // users-controller
  getUsers: (req, res) => {
    // sequelize搜尋
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
  },

  toggleAdmin: (req, res) => {
    const id = req.params.id
    return Promise.all([
      User.findAll({
        raw: true,
        nest: true
      }),
      User.findByPk(id)
    ])
      .then(([users, user]) => {
        users.forEach(result => {
          if (result.id === Number(id)) result.isAdmin = result.isAdmin === 1 ? 0 : 1
        })
        const adminArr = users.filter(result => result.isAdmin)
        if (adminArr.length === 0) {
          req.flash('error_messages', 'just only one admin ! you cant do that !')
          return res.redirect('/admin/users')
        }
        if (adminArr.length > 0) {
          user.update({ isAdmin: !user.isAdmin })
            .then(() => {
              req.flash('success_messages', 'user was successfully to update')
              return res.redirect('/admin/users')
            })
        }
      })
  }
}

module.exports = adminController
