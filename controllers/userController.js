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
      Comment.findAll({ where: { UserId: req.params.id }, raw: true, nest: true, include: [Restaurant, User] }),
      Restaurant.findAll({ raw: true, nest: true, include: [{ model: User, as: 'FavoritedUsers', where: { id: req.params.id } }] }), // userId 固定，算有多少favoriteRestaurants
      User.findAll({ raw: true, nest: true, include: [{ model: User, as: 'Followers', where: { id: req.params.id } }] }), // followerid 固定，算有多少following
      User.findAll({ raw: true, nest: true, include: [{ model: User, as: 'Followings', where: { id: req.params.id } }] }) // followingid 固定，算有多少follower
    ])
      .then(([user, comments, favoriteRestaurants, followings, followers]) => {
        console.log('followers:' + followers)
        console.log('following:' + followings)
        console.log('favoriteRestaurants:' + favoriteRestaurants)
        const totalComment = comments.length
        const totalFavoriteRestaurants = favoriteRestaurants.length
        const totalFollowers = followers.length
        const totalFollowings = followings.length
        res.render('user', { users: user, totalComment, comments, favoriteRestaurants, totalFavoriteRestaurants, followers, totalFollowers, followings, totalFollowings })
      })
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
        // 排除追蹤自己
        const me = helpers.getUser(req).id
        return res.render('topUser', { users, me })
      })
  },
  addFollowing: (req, res) => {
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(() => res.redirect('back'))
  },
  removeFollowing: (req, res) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy()
        .then(() => res.redirect('back'))
    })
  }
}

module.exports = userController