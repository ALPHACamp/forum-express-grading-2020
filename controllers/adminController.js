const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch(err => res.send(err))
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('warning_msg', '請填寫名稱')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)

        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null, CategoryId: req.body.categoryId
        })
          .then(restaurant => {
            req.flash('success_msg', 'restaurant was successfully created')
            res.redirect('/admin/restaurants')
          })
          .catch(err => res.send(err))

      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
        image: file ? `/upload/${file.originalname}` : null,
        CategoryId: req.body.categoryId
      })
        .then(restaurant => {
          req.flash('success_msg', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
        .catch(err => res.send(err))
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => res.send(err))
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
          })
      })
      .catch(err => res.send(err))
  },
  putRestaurant: (req, res) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)

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
                req.flash('success_messages', 'restaurant was successfully updated')
                res.redirect('/admin/restaurants')
              })
              .catch(err => res.send(err))

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
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(() => res.redirect('/admin/restaurants'))
      })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
  },
  putUser: (req, res) => {
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

module.exports = adminController