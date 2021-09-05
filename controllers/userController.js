const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const db = require('../models/index')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    // confirm password
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name,
              email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => res.redirect('/signIn'))
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

  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        return res.render('userProfile', { userProfile: user.toJSON() })
      })
  },

  editUser: (req, res) => {
    return res.render('editUser')
  },

  putUser: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error: ', err)
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name,
              image: file ? img.data.link : user.image
            })
              .then(user => {
                req.flash('success_messages', 'user was successfully to update')
                return res.redirect(`/users/${user.id}`)
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          return user.update({
            name
          })
            .then(user => {
              req.flash('success_messages', 'user was successfully to update')
              return res.redirect(`/users/${user.id}`)
            })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },

  removeFavorite: async (req, res) => {
    // 練習使用async await
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      await favorite.destroy()
      return res.redirect('back')
    } catch (err) {
      console.warn(err)
    }
  },

  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.warn(err)
    }
  },

  removeLike: async (req, res) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      await like.destroy()
      return res.redirect('back')
    } catch (err) {
      console.warn(err)
    }
  },

  getTopUser: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        // 因為沒有row:true
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    })
  }
}

module.exports = userController
