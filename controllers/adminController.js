const db = require('../models')
const Restaurant = db.Restaurant
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Category = db.Category
const helpers = require('../_helpers')
// req.user -> helpers.getUser(req)

const adminController = {
  // 瀏覽頁面
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },
  // 新增資料
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    if (!name) {
      req.flash('error_messages', '請填寫餐廳名稱!')
      return res.redirect('back')
    }

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        })
          .then((restaurant) => {
            req.flash('success_messages', '已成功建立餐廳名單')
            res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null,
        CategoryId: categoryId
      })
        .then((restaurant) => {
          req.flash('success_messages', '已成功建立餐廳名單')
          res.redirect('/admin/restaurants')
        })
    }
  },
  // 瀏覽餐廳
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  },
  // 編輯餐廳
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories,
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    if (!name) {
      req.flash('error_messages', '請填寫餐廳名稱!')
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            })
              .then((restaurant) => {
                req.flash('success_messages', '已成功建立餐廳名單')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image,
            CategoryId: categoryId
          })
            .then((restaurant) => {
              req.flash('success_messages', '已成功建立餐廳名單')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  // 刪除餐廳
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },
  // 使用者變更
  getUsers: (req, res) => {
    const userId = helpers.getUser(req).id
    return User.findAll({ raw: true }).then(users => {
      res.render('admin/users', { users, userId })
    })
  },
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        user.update({
          isAdmin: !user.isAdmin
        })
          .then((user) => {
            req.flash('success_messages', `${user.name}的使用者權限已更新`)
            res.redirect('/admin/users')
          })
      })
  }
}

module.exports = adminController
