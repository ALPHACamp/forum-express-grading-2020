const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'bc7f856273b68e8'

const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const Comment = db.Comment


// 引入處理檔案的模組
const fs = require('fs')

const adminService = require('../services/adminService.js')

const adminController = {
  getRestaurants: (req, res) => {
    // 自動導到views文件夾，找到admin文件的restaurants.handlebars
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      return res.render('admin/create', { categories })
    })
  },

  // postRestaurant: (req, res) => {
  //   const { name, tel, address, opening_hours, description } = req.body

  //   if (!name) {
  //     req.flash('warning_messages', "不存在空白的餐廳名稱!")
  //     return res.redirect('back')
  //   }

  //   const { file } = req 
  //   if (file) {
  //     imgur.setClientID(IMGUR_CLIENT_ID)
  //     imgur.upload(file.path, (err, img) => {
  //       if (err) {
  //         console.log('upload fail: %o', err);
  //         res.send('');
  //         return;
  //       }
  //       return Restaurant.create({
  //         name: req.body.name,
  //         tel: req.body.tel,
  //         address: req.body.address,
  //         opening_hours: req.body.opening_hours,
  //         description: req.body.description,
  //         image: file ? img.data.link : null,
  //         CategoryId: req.body.categoryId
  //       }).then((restaurant) => {
  //         req.flash('success_msg', 'restaurant was successfully created')
  //         return res.redirect('/admin/restaurants')
  //       }).catch(err => console.log(err))
  //     })
  //   } else {
  //     return Restaurant.create({ name, tel, address, opening_hours, description, image: null, CategoryId: req.body.categoryId })
  //       .then(() => {
  //         req.flash('success_msg', '成功新增餐廳!')
  //         res.redirect('/admin/restaurants')
  //       })
  //   }
  // },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('warning_messages', "不存在空白的餐廳名稱!")
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      return res.redirect('/admin/restaurants')
    })
  },

  readRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true }).then(restaurant => {
      Category.findAll({ raw: true, nest: true }).then(categories => {
        return res.render('admin/create', { categories, restaurant })
      })
    })
  },

  putRestaurant: (req, res) => {
    const id = req.params.id
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('warning_msg', '請填寫餐廳名稱!')
      return res.rediect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) {
          console.log('upload fail: %o', err);
          res.send('');
          return;
        }
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
                req.flash('success_msg', '餐廳資訊已成功修改!')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
    return Restaurant.findByPk(id)
      .then(restaurant => {
        restaurant.update({
          name, tel, address, opening_hours, description, CategoryId: req.body.categoryId
        })
      })
      .then(restaurant => {
        req.flash('success_msg', '餐廳資訊已成功修改!')
        res.redirect('/admin/restaurants')
      })
    }
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_msg', '此餐廳資訊已成功刪除!')
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true }).then(users => {
      users.forEach(user => {
        if (user.isAdmin === 0) {
          user.isAdmin = 'user'
          user.setting = 'set as admin'
        } else {
          user.isAdmin = 'admin'
          user.setting = 'set as user'
        }
      })
      return res.render('admin/users', { users })
    })
  },

  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user.isAdmin === false ? user.isAdmin = true : user.isAdmin = false
      return user.update({ isAdmin: user.isAdmin })
        .then(() => {
          req.flash('success_msg', '已修改使用者權限！')
          res.redirect('/admin/users')
        })
    })
  },

  deleteComment: (req, res) => {
    console.log('##', req.body.restaurantId)
    return Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then((comment) => {
            res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  }
}

module.exports = adminController