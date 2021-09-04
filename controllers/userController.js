const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

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

  getUser: (req, res) => {
    const userId = req.params.id
    const user = helpers.getUser(req)
    User.findByPk(userId, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(userFind => {
        Comment.findAll({
          raw: true,
          nest: true,
          include: Restaurant,
          where: { userId }
        })
          .then(result => {
            const data = result.map(comment => ({
              ...comment.dataValues,
              restaurantImage: comment.Restaurant.image,
              restaurantId: comment.Restaurant.id
            }))
            const set = new Set()
            const comments = data.filter(item => !set.has(item.id) ? set.add(item.id) : false)
            const commentCount = comments.length
            const favorites = userFind.FavoritedRestaurants
            const favoriteCount = favorites.length
            const followings = userFind.Followings
            const followingCount = followings.length
            const followers = userFind.Followers
            const followerCount = followers.length
            res.render('profile', { userFind: userFind.toJSON(), user, commentCount, comments, favoriteCount, followingCount, followerCount, followings, followers, favorites })
          })
      })
  },

  editUser: (req, res) => {
    const user = helpers.getUser(req)
    if (user.id !== Number(req.params.id)) {
      req.flash('error_messages', 'you can only edit your own profile')
      return res.redirect(`/users/${user.id}/edit`)
    }
    return res.render('editUser', { user })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', "you can't edit other's profile")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) {
          return console.log(err)
        }
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
              .then(() => {
                req.flash('success_messages', 'user was successfully to update')
                res.redirect(`/users/${req.params.id}`)
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          })
            .then(() => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${req.params.id}`)
            })
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
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
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  unlike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then(() => {
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
      return res.render('topUser', { users: users })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
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
