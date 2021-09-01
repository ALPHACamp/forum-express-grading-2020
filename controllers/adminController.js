const db = require('../models/index')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const mysql = require('mysql2')
let userSql = process.env.NODE_ENV

if (userSql === 'development') {
  userSql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'forum',
    password: 'password'
  })
} else if (userSql === 'production') {
  userSql = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'be02a1b756cd61',
    database: 'heroku_35f66ed46263e72',
    password: '348b0305'
  })
}

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
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
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error: ', err)
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
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
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
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
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(() => res.redirect('/admin/restaurants'))
      })
  },

  // users-controller
  getUsers: (req, res) => {
    if (process.env.NODE_ENV === 'test') {
    // sequelize搜尋
      return User.findAll({ raw: true })
        .then(users => res.render('admin/users', { users }))
    }

    // sql搜尋
    userSql.query(
      'SELECT `id`, `name`, `email`, `isAdmin` FROM `users`',
      (err, users) => {
        if (err) return console.log('err: ', err)
        res.render('admin/users', { users })
      }
    )
  },
  toggleAdmin: (req, res) => {
    const id = req.params.id
    if (process.env.NODE_ENV === 'test') {
      // sequelize搜尋
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({ isAdmin: !user.isAdmin })
            .then(() => {
              req.flash('success_messages', 'user was successfully to update')
              return res.redirect('/admin/users')
            })
        })
    }

    // 試用sql語法搜尋
    // 增加判斷若admin只剩一位，釋出警告
    userSql.query(
      'SELECT `isAdmin`, `id` FROM `users`',
      (err, results) => {
        if (err) throw err
        results.forEach(result => {
          if (result.id === Number(id)) result.isAdmin = result.isAdmin === 1 ? 0 : 1
        }) // 這裡沒辦法用result.isAdmin = !user.isAdmin 是因為它傳過來的isAdmin檔案已經是number?
        const adminArr = results.filter(result => result.isAdmin)
        if (adminArr.length === 0) {
          req.flash('error_messages', 'just only one admin ! you cant do that !')
          return res.redirect('/admin/users')
        }
        if (adminArr.length > 0) {
          const updateSql = 'UPDATE users SET isAdmin = NOT isAdmin WHERE id = ?'
          // ?防止SQL injection
          userSql.query(updateSql, id,
            (err, results) => {
              if (err) throw err
              req.flash('success_messages', 'user was successfully to update')
              return res.redirect('/admin/users')
            })
        }
      }
    )
  }
}

module.exports = adminController
