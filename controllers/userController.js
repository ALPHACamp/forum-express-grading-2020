const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const helper = require('../_helpers')

const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userController = {
  // User authentication
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('error_messages', 'Password & Password Check is different!')
      return res.redirect('/signup')
    }

    User.findOne({ where: { email } }).then(user => {
      if (user) {
        req.flash('error_messages', `email: '${user.email}' has already existed!`)
        return res.redirect('/signup')
      }
      User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        req.flash('success_messages', `email: '${user.email}' is registered successfully!`)
        res.redirect('/signin')
      })
        .catch(err => console.error(err))
    })
  },

  signInPage: (req, res) => res.render('signin'),

  signIn: passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/signIn',
    successFlash: true,
    failureFlash: true
  }),

  logout: (req, res) => {
    req.flash('success_messages', 'logout successfully!')
    req.logout()
    res.redirect('/signin')
  },

  // User profile
  getUser: (req, res) => {
    const UserId = req.params.id
    User.findByPk(UserId, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
    }).then(user => {
      const userJSON = user.toJSON()
      const profile = {
        id: userJSON.id,
        name: userJSON.name,
        email: userJSON.email,
        image: userJSON.image
      }
      const followings = userJSON.Followings
      const followers = userJSON.Followers
      const FavoritedRestaurants = userJSON.FavoritedRestaurants

      const allCommentedRests = userJSON.Comments.map(comment => comment.Restaurant)
      const uniqueRests = Array.from(new Set(allCommentedRests
        .map(item => item.id)))
        .map(id => allCommentedRests.find(item => item.id === id))

      return res.render('profile', {
        profile,
        countOfFollowings: followings.length,
        followings,
        countOfFollowers: followers.length,
        followers,
        countOfComments: userJSON.Comments.length,
        countOfCommentRests: uniqueRests.length,
        commentedRestaurants: uniqueRests,
        countOfFavoritedRests: FavoritedRestaurants.length,
        FavoritedRestaurants
      })
    })
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user =>
      res.render('profileEdit', { profile: user.toJSON() })
    )
  },

  putUser: (req, res) => {
    const { id } = req.params
    const update = req.body
    const { file } = req
    if (!update.name) {
      req.flash('error_messages', "name field is required.")
      return res.redirect('back')
    }

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error: ', err)
        return User.findByPk(id).then(user => {
          update.image = file ? img.data.link : user.image
          user.update(update).then(user => {
            req.flash('success_messages', `user '${user.name}' was updated successfully!`)
            res.redirect(`/users/${user.id}`)
          })
        })
      })
    } else {
      User.findByPk(id).then(user => {
        update.image = user.image
        user.update(update).then(user => {
          req.flash('success_messages', `user '${user.name}' was updated successfully!`)
          res.redirect(`/users/${user.id}`)
        })
      })
    }
  },

  // Favorite restaurants
  addFavorite: (req, res) => {
    const UserId = helper.getUser(req).id
    const { RestaurantId } = req.params
    Favorite.create({ UserId, RestaurantId }).then(() =>
      res.redirect('back')
    )
  },

  removeFavorite: (req, res) => {
    const UserId = helper.getUser(req).id
    const { RestaurantId } = req.params
    Favorite.findOne({ where: { UserId, RestaurantId } }).then(favorite =>
      favorite.destroy().then(() => res.redirect('back'))
    )
  },

  // Like restaurants
  like: (req, res) => {
    const UserId = helper.getUser(req).id
    const RestaurantId = req.params.restaurantId
    Like.create({ UserId, RestaurantId })
      .then(() => res.redirect('back'))
  },

  unlike: (req, res) => {
    const UserId = helper.getUser(req).id
    const RestaurantId = req.params.restaurantId
    Like.findOne({ where: { UserId, RestaurantId } }).then(like =>
      like.destroy().then(() => res.redirect('back'))
    )
  },

  getTopUser: (req, res) => {
    User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(item => item.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    })
  },

  follow: (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.userId
    Followship.create({ followerId, followingId })
      .then(() => res.redirect('back'))
  },

  unfollow: (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.userId
    Followship.findOne({ where: { followerId, followingId } })
      .then(followship => {
        followship.destroy().then(() => res.redirect('back'))
      })
  }
}

module.exports = userController
