const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'bc7f856273b68e8'

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        callback({ status: 'success', message: '', restaurants: restaurants })
      })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        callback({ restaurant: restaurant.toJSON() })
      })
  },

  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name) {
      return callback({ status: 'error', message: 'name doesn\'t exist!' })
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) {
          console.log('upload fail: %o', err);
          res.send('');
          return;
        }
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          callback({ status: 'success', message: 'Restaurant is successfully created!'})
        }).catch(err => console.log(err))
      })
    } else {
      return Restaurant.create({ name, tel, address, opening_hours, description, image: null, CategoryId: req.body.categoryId })
        .then(() => {
          callback({ status: 'success', message: 'Restaurant is successfully created!' })
        })
    }
  },

  editRestaurant: (req, res, callback) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true }).then(restaurant => {
      Category.findAll({ raw: true, nest: true }).then(categories => {
        callback({ categories, restaurant })
      })
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
  }
}

module.exports = adminService