const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const fs = require('fs')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_msg', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_msg', '信箱重複！')
            return res.redirect('/signup')
          }
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_msg', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        return Comment.findAndCountAll({
          where: { UserId: id },
          include: [{ model: Restaurant, attributes: ['id', 'image'] }],
          raw: true,
          nest: true
        }).then(comments => {
          console.log(comments.rows)
          return res.render('user', {
            user: user.toJSON(),
            comments: comments.rows,
            count: comments.count
          })
        })
      })
  },

  editUser: (req, res) => {
    User.findOne({ where: { id: req.params.id } })
      .then(user => {
        res.render('editUser', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', 'please enter your name')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findOne({ where: { id: req.params.id } })
            .then((user) => {
              user.update({
                name: req.body.name,
                image: file ? `/upload/${file.originalname}` : user.image
              }).then((user) => {
                req.flash('success_msg', 'user was successfully to update')
                res.redirect(`/users/${user.id}`)
              })
            })
        })
      })
    } else {
      return User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          }).then((user) => {
            req.flash('success_msg', 'user was successfully to update')
            res.redirect(`/users/${user.id}`)
          })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      return favorite.destroy()
        .then(restaurant => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = userController