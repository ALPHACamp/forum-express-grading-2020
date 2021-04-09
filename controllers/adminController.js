const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {

  // 全部餐廳頁面
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      return res.render('admin/restaurants', { restaurants })
    } catch (e) {
      console.log(e)
    }
  },

  // 建立餐廳頁面
  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      console.log(categories)
      return res.render('admin/create', { categories: categories })
    } catch (e) {
      console.log(e)
    }
  },

  // 建立餐廳資料
  postRestaurant: (req, res) => {
    // eslint-disable-next-line camelcase
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req
    if (file) {
      console.log('file有喔')
      imgur.setClientID(IMGUR_CLIENT_ID)
      // eslint-disable-next-line node/handle-callback-err
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null
        })
          .then(() => {
            req.flash('success_messages', '餐廳建立成功')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
      })
        .then(() => {
          req.flash('success_messages', '餐廳建立成功')
          return res.redirect('/admin/restaurants')
        })
    }
  },

  // 單獨餐廳詳細頁面
  getRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      return res.render('admin/restaurant', { restaurant })
    } catch (e) {
      console.log(e)
    }
  },

  // 編輯餐廳頁面
  editRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { restaurant, categories })
    } catch (e) {
      console.log(e)
    }
  },

  // 編輯餐廳資料
  putRestaurant: (req, res) => {
    // eslint-disable-next-line camelcase
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    const id = req.params.id
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      // eslint-disable-next-line node/handle-callback-err
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(id)
          .then((restaurant) => {
            restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image,
              categoryId
            })
              .then(() => {
                req.flash('success_messages', '餐廳更新成功')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(id)
        .then((restaurant) => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image
          })
            .then(() => {
              req.flash('success_messages', '餐廳更新成功')
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
      req.flash('success_messages', '餐廳刪除成功')
      res.redirect('/admin/restaurants')
    } catch (e) {
      console.log(e)
    }
  },

  // 權限頁面
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true })
      res.render('admin/users', { users })
    } catch (e) {
      console.log(e)
    }
  },

  // 改變權限
  toggleAdmin: async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findByPk(id)
      await user.update({ ...user, isAdmin: user.isAdmin ? 0 : 1 })
      req.flash('success_messages', '權限更新完成')
      res.redirect('/admin/users')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
