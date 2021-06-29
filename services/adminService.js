const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        callback({ restaurants })
      })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        callback({ restaurant: restaurant.toJSON() })
      })
  },

  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return callback({ categories })
    })
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            callback({ status: 'success', message: '' })
          })
      })
  },

  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({
        status: 'error',
        message: 'name didn\'t exist'
      })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
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
                callback({
                  status: 'success',
                  message: 'restaurant was successfully to update'
                })
              })
          })
      })
    }
    else {
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
              callback({
                status: 'success',
                message: 'restaurant was successfully to update'
              })
            })
        })
    }
  },

  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({
        status: 'error',
        message: 'Please enter category\'s name.'
      })
    }
    return Category.create({ name })
      .then(category => {
        callback({
          status: 'success',
          message: 'Category was successfully created!'
        })
      })
  },

  putCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({
        status: 'error',
        message: 'Please enter category\'s name'
      })
    }
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({
            name
          })
        })
        .then(restaurant => {
          callback({
            status: 'success',
            message: 'Category was successfully to update.'
          })
        })
    })
  },
}

module.exports = adminService