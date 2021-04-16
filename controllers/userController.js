/* eslint-disable node/handle-callback-err */
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const { getUser } = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {

  // 註冊 get
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  // 註冊 post
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (!name || !email || !password || !passwordCheck) {
      console.log('error_messages : 全部都要輸入')
      req.flash('error_messages', '全部都需要輸入')
      return res.render('signup', { name, email })
    }
    if (!email.match(/.+@.+\..+/)) {
      console.log('error_messages : 請輸入正確信箱')
      req.flash('error_messages', '請輸入正確信箱')
      return res.render('signup', { name, email })
    }
    if (!password.match(/[_a-zA-Z0-9_]{8,}/)) {
      console.log('error_messages : 請輸入八位以上英文或數字')
      req.flash('error_messages', '請輸入八位以上英文或數字')
      return res.render('signup', { name, email })
    }
    if (passwordCheck !== password) {
      console.log('error_messages : 密碼與確認密碼不相符！')
      req.flash('error_messages', '密碼與確認密碼不相符！')
      return res.redirect('/signup')
    }
    const user = User.findOne({ where: { email } })
    if (user) {
      req.flash('error_messages', '信箱重複！')
      return res.redirect('/signup')
    }
    User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
    req.flash('success_messages', '成功註冊帳號！')
    return res.redirect('/signin')
  },

  // 登入 get
  signInPage: (req, res) => {
    return res.render('signin')
  },

  // 登入 post
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return getUser(req).isAdmin ? res.redirect('/admin/restaurants') : res.redirect('/restaurants')
  },

  // 登出 get
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    return res.redirect('/signin')
  },

  // 取得 profile
  getUser: async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findByPk(id, {
        include: [
          { model: Comment, include: Restaurant },
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      // eslint-disable-next-line array-callback-return
      const commentsRestaurant = user.Comments.map((comment) => {
        return comment.dataValues.Restaurant.dataValues
      })
      const isFollowed = req.user.Followings.map(data => data.id).includes(user.id)
      return res.render('users/profile', { user: user.toJSON(), commentsRestaurant, isFollowed })
    } catch (e) {
      console.loge(e)
    }
  },

  // 編輯 profile
  editUser: async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findByPk(id, { raw: true })
      return res.render('users/edit', { user })
    } catch (e) {
      console.log(e)
    }
  },

  // 更新 profile
  putUser: (req, res) => {
    const id = req.params.id
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then((user) => {
            user.update({
              name: user.name,
              image: file ? img.data.link : user.image
            })
          })
          .then(() => {
            req.flash('success_messages', '使用者更新成功')
            res.redirect(`/users/${id}`)
          })
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({
            name: user.name,
            image: user.image
          })
        })
        .then(() => {
          req.flash('success_messages', '使用者更新成功')
          res.redirect(`/users/${id}`)
        })
    }
  },

  // 加入最愛
  addFavorite: async (req, res) => {
    const UserId = req.user.id
    const RestaurantId = req.params.restaurantId
    try {
      await Favorite.create({ UserId, RestaurantId })
      req.flash('success_messages', '成功加入我的最愛')
      res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  // 刪除最愛
  removeFavorite: async (req, res) => {
    const UserId = req.user.id
    const RestaurantId = req.params.restaurantId
    try {
      const favorite = await Favorite.findOne({ where: { UserId, RestaurantId } })
      favorite.destroy()
      req.flash('success_messages', '成功刪除我的最愛')
      res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  // 加入收藏
  addLike: async (req, res) => {
    const UserId = req.user.id
    const RestaurantId = req.params.restaurantId
    try {
      await Like.create({ UserId, RestaurantId })
      req.flash('success_messages', '成功加入我的收藏')
      res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  // 刪除收藏
  removeLike: async (req, res) => {
    const UserId = req.user.id
    const RestaurantId = req.params.restaurantId
    try {
      const like = await Like.findOne({ where: { UserId, RestaurantId } })
      like.destroy()
      req.flash('success_messages', '成功刪除我的收藏')
      res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  // 取得 top 10 使用者
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => a.FavoriteCount < b.FavoriteCount ? 1 : -1).slice(0, 10)
      return res.render('topUser', { users: users })
    })
  },

  // 加入追蹤
  addFollowing: async (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.userId
    try {
      await Followship.create({ followerId, followingId })
      req.flash('success_messages', '成功加入我的收藏')
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  // 刪除追蹤
  removeFollowing: async (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.userId
    try {
      const followship = await Followship.findOne({ where: { followerId, followingId } })
      followship.destroy()
      req.flash('success_messages', '成功刪除我的追蹤')
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = userController
