const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userController = {
  signUpPage: (req, res) => { return res.render('signup') },
  signUp: (req, res) => { // 處理註冊「行為」
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        }
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          req.flash('success_messages', '成功註冊帳號！')
          return res.redirect('/signin')
        })

      })
  },
  signInPage: (req, res) => { return res.render('signin') },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/restaurants')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.findAll({ where: { UserId: req.params.id }, raw: true, nest: true, include: [Restaurant, User] })
    ])
      .then(([user, comments]) => res.render('user', { users: user, totalComment: comments.length, comments }))
  },
  editUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => res.render('userEdit', { users: user.toJSON() }))
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請填寫使用者名稱')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({ name: req.body.name, image: file ? img.data.link : user.image })
              .then(() => {
                req.flash('success_messages', '使用者資料更新成功。')
                res.redirect(`/users/${req.params.id}`)
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({ name: req.body.name, image: user.image })
            .then(() => {
              req.flash('success_messages', '使用者資料更新成功。')
              res.redirect(`/users/${req.params.id}`)
            })
        })
    }
  },
  addFavorite: (req, res) => {
    Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(() => res.redirect('back'))
  },
  removeFavorite: (req, res) => {
    Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        favorite.destroy()
          .then(() => res.redirect('back'))
      })
  },
  addLike: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(() => res.redirect('back'))
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        like.destroy()
          .then(() => res.redirect('back'))
      })
  },
  getTopUser: (req, res) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length, // 計算有多少人追蹤
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id) // 我的 Followings 清單內是否有追蹤 Followers 內的 user 物件
        }))
        // 依追蹤者人數排序清單
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        return res.render('topUser', { users })
      })
  }
}

module.exports = userController