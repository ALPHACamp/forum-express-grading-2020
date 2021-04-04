const db = require('../models')
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'process.env.IMGUR_CLIENT_ID'

const adminController = {

  // 全部餐廳頁面
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (e) {
      console.log(e)
    }
  },

  // 建立餐廳頁面
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  // 建立餐廳資料
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      // eslint-disable-next-line node/handle-callback-err
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then(() => {
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

  // 單獨餐廳詳細頁面
  getRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true })
      return res.render('admin/restaurant', { restaurant })
    } catch (e) {
      console.log(e)
    }
  },

  // 編輯餐廳頁面
  editRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true })
      return res.render('admin/create', { restaurant })
    } catch (e) {
      console.log(e)
    }
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      // eslint-disable-next-line node/handle-callback-err
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image
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
            image: restaurant.image
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },

  // 刪除餐廳
  deleteRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id)
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
