const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')


const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '3c3d0cbfc6f3f23'

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
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
  },
  getUser: async (req, res) => {
    const id = req.params.id

    // 取得使用者的評論、收藏、追蹤資料
    const user = await User.findByPk(id)

    const commentedRest = await Comment.findAll({
      raw: true,
      nest: true,
      include: [{
        model: User,
        where: { id }
      }, Restaurant]
    })

    let userFavor = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' }
      ]
    })

    const followInfo = await User.findByPk(id, {
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })



    //將各個拿到的資料的id, image整理成 array
    const totalRestInfo = commentedRest.map(item => {
      return {
        id: item.Restaurant.id,
        image: item.Restaurant.image
      }
    })

    let userFollowing = followInfo.dataValues.Followings
    userFollowing = userFollowing.map(item => ({
      id: item.dataValues.id,
      image: item.dataValues.image
    }))

    let userFollower = followInfo.dataValues.Followers
    userFollower = userFollower.map(item => ({
      id: item.dataValues.id,
      image: item.dataValues.image
    }))

    userFavor = userFavor.dataValues.FavoritedRestaurants
    userFavor = userFavor.map(item => ({
      id: item.dataValues.id,
      image: item.dataValues.image
    }))

    //將重複評論的餐廳去除
    const set = new Set()
    const restInfo = totalRestInfo.filter(item => {
      return !set.has(item.id) ? set.add(item.id) : false
    })
    //整理各個總數
    const totalCount = {
      countComment: restInfo.length,
      countFavor: userFavor.length,
      countFollower: userFollower.length,
      countFollowing: userFollowing.length,
    }
    console.log(totalCount)

    return res.render('userProfile', {
      id: helpers.getUser(req).id,
      thisUser: user.toJSON(),
      totalCount,
      restInfo,
      userFavor,
      userFollower,
      userFollowing
    })  
  },
  editUser: (req, res) => {
    res.render('editProfile', {
      user: req.user
    })
  },
  putUser: (req, res) => {
    const { file } = req
    console.log()
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: img.data.link
            }).then((user) => {
              req.flash('success_msg', '成功更新用戶資料')
              res.redirect(`/users/${user.id}`)
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name
          }).then((user) => {
            req.flash('success_msg', '成功更新用戶資料')
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

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  addLike: async (req, res) => {
    console.log(helpers.getUser(req).id)
    await Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
    return res.redirect('back')
  },
  removeLike: async (req, res) => {
    const like = await Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
    like.destroy()
    return res.redirect('back')
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