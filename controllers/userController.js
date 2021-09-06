const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')
// req.user -> helpers.getUser(req)

const userController = {
  // 登入註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            // req.flash('success_messages', '成功註冊帳號!')
            return res.redirect(307, '/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },

  // Profile頁面
  getUser: (req, res) => {
    // prevent access to other user profile
    // if (helpers.getUser(req).id !== Number(req.params.id)) {
    //   return res.redirect(`/users/${getUser(req).id}`)
    // }
    return User.findAndCountAll({
      include: [{ model: Comment, include: [Restaurant] }],
      where: { id: Number(req.params.id) }
    })
      .then(result => {
        return res.render('profile', {
          count: result.count,
          user: result.rows[0].toJSON()
        })
      })
  },

  editUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.redirect(`/users/${getUser(req).id}`)
    }

    User.findByPk(req.params.id)
      .then(user => {
        return res.render('editProfile', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    const { name } = req.body
    const { file } = req
    if (!name) {
      req.flash('error_messages', '請輸入暱稱')
      return res.redirect('back')
    }

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name,
              image: file ? img.data.link : user.image
            })
              .then((user) => {
                req.flash('success_messages', '已成功更改資料')
                res.redirect(`/users/${helpers.getUser(req).id}`)
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name,
            image: user.image
          })
            .then((user) => {
              req.flash('success_messages', '已成功更改資料')
              res.redirect(`/users/${helpers.getUser(req).id}`)
            })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy()
        .then(() => {
          return res.redirect('back')
        })
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      return res.redirect('back')
    })
  },

  unLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy()
        .then((restaurant) => {
          return res.redirect('back')
        })
    })
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    }).then(() => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy()
        .then(() => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = userController
