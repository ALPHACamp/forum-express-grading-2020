const fs = require('fs')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Like = db.Like
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            ),
          }).then((user) => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //新增/移除最愛
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return res.redirect('back')
      })
    })
  },

  //新增/移除喜歡
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((like) => {
      like.destroy().then((restaurant) => {
        return res.redirect('back')
      })
    })
  },

  getUser: (req, res) => {
    const id = Number(req.params.id)
    const userId = helpers.getUser(req).id
    return User.findByPk(id)
      .then((user) => {
        return res.render('profile', { user: user.toJSON(), userId })
      })
      .catch((error) => console.log(error))
  },

  editUser: (req, res) => {
    const id = Number(req.params.id)
    const userId = helpers.getUser(req).id
    if (userId !== id) {
      req.flash('error_message', '只能編輯自己的Profile')
      return res.redirect(`/users/${userId}/edit`)
    }
    return User.findByPk(req.params.id).then((user) => {
      return res.render('editProfile', { user: user.toJSON() })
    })
  },

  putUser: (req, res) => {
    const id = req.params.id
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            })
          })
          .then(() => {
            req.flash('success_message', '使用者資料已更新')
            res.redirect(`/users/${id}`)
          })
          .catch((error) => console.log(error))
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({
            name: req.body.name,
          })
        })
        .then((user) => {
          req.flash(
            'success_messages',
            'user profile was successfully to update'
          )
          res.redirect(`/users/${id}`)
        })
        .catch((error) => console.log(error))
    }
  },
}

module.exports = userController
