const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const userController = {
  //User 登入功能
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
  },//A19 User Profile功能-->//A23 更新功能
  getUser: (req, res) => {
    const UserId = Number(req.params.id)
    return Promise.all([
      User.findByPk(UserId, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          { model: Restaurant, as: 'FavoritedRestaurants' }
        ]
      }),
      Comment.findAndCountAll({
        where: { UserId }, attributes: ['RestaurantId'], group: ['RestaurantId'], include: Restaurant,
        raw: true, nest: true
      }),
    ])
      .then(([profile, comments]) => {
        const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(UserId)
        console.log('comments', comments)
        return res.render('profile', { profile: profile.toJSON(), commentedRestaurants: comments.rows, isFollowed })
      })
      .catch(error => res.status(422).json(error))
  },
  editUser: (req, res) => {
    if (String(helpers.getUser(req).id) !== String(req.params.id)) {
      req.flash('error_messages', '無法編輯其他使用者的資料')
      return res.redirect(`/users/${req.user.id}`)
    }
    User.findByPk(req.params.id)
      .then(user => {
        return res.render('editProfile', { user: user.toJSON() })
      })
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '使用者名稱為必填資訊！')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(`Error: ${err}`)
        return User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            image: file ? img.data.link : user.image
          }).then(() => {
            req.flash('success_messages', '已成功修改使用者資料')
            res.redirect(`/users/${req.params.id}`)
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          image: user.image
        })
          .then(() => {
            req.flash('success_messages', '已成功修改使用者資料')
            res.redirect(`/users/${req.params.id}`)
          })
          .catch(err => console.error(err))
      })
    }
  },
  //加入/移除最愛功能
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        req.flash('success_messages', '已添加到我的最愛!')
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        req.flash('success_messages', '已從我的最愛移除!')
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  // A21 Like/Unlike功能
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        req.flash('success_messages', 'You like it!')
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            req.flash('success_messages', 'You don\'t like it!')
            return res.redirect('back')
          })
      })
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
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  //追蹤功能
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController
