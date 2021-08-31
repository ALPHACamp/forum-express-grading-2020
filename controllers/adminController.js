const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then((restaurants) => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then((restaurant) => {
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render('admin/create', { restaurant: restaurant })
      }
    )
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
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image
            })
            .then((restaurant) => {
              req.flash(
                'success_messages',
                'restaurant was successfully to update'
              )
              res.redirect('/admin/restaurants')
            })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
          })
          .then((restaurant) => {
            req.flash(
              'success_messages',
              'restaurant was successfully to update'
            )
            res.redirect('/admin/restaurants')
          })
      })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then((restaurant) => {
        res.redirect('/admin/restaurants')
      })
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true, nest: true })
      .then((users) => {
        return res.render('admin/users', { users })
      })
      .catch((error) => console.log(error))
  },
  toggleAdmin: async (req, res) => {
    const id = req.params.id
    let { count } = await User.findAndCountAll({
      where: { isAdmin: 1 }
    })

    return User.findByPk(id)
      .then((user) => {
        user.isAdmin = user.isAdmin ? false : true
        count = user.isAdmin ? count + 1 : count - 1

        if (!count) {
          req.flash('error_messages', 'At least one admin is required')
          return res.redirect('back')
        }

        return user.update({
          isAdmin: user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', 'User permissions have been updated')
        res.redirect('/admin/users')
      })
  }
}

module.exports = adminController
