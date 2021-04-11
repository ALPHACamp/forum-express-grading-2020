const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
//const { like } = require('sequelize/types/lib/operators')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('warning_msg', '兩次密碼輸入不同！')
      return res.render('signup', { name, email, password, passwordCheck })
    } else {
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('warning_msg', '此信箱已註冊！')
            return res.render('signup', { name, email, password, passwordCheck })
          } else {
            User.create({
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_msg', '註冊成功，請登入！')
                return res.redirect('/signin')
              })
          }
        })
        .catch(err => res.send(err))
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    const check = (Number(helpers.getUser(req).id) === Number(req.params.id))
    User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    })
      .then(result => {
        const commentCount = result.Comments.length
        const restaurantList = result.Comments.map(comment => ({
          ...comment.Restaurant.dataValues, comment: comment.text
        }))
        res.render('profile', {
          result: result.toJSON(),
          commentCount,
          restaurantList,
          check
        })
      })
      .catch(err => res.send(err))
  },
  editUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        res.render('editProfile', { user: user.toJSON() })
      })
      .catch(err => res.send(err))
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('warning_msg', "名字不見了?")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)

        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              image: file ? img.data.link : user.image
            })
              .then((user) => {
                req.flash('success_msg', 'Your profile was successfully updated')
                res.redirect(`/users/${user.id}`)
              })
          })
          .catch(err => res.send(err))
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            email: req.body.email,
          })
            .then(user => {
              req.flash('success_msg', 'Your profile was successfully updated')
              res.redirect(`/users/${user.id}`)
            })
        })
        .catch(err => res.send(err))
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      RestaurantId: req.params.restaurantId,
      UserId: helpers.getUser(req).id
    })
      .then(() => res.redirect('back'))
      .catch(err => res.send(err))
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        RestaurantId: req.params.restaurantId,
        UserId: helpers.getUser(req).id
      }
    })
      .then(favorite => {
        favorite.destroy()
          .then(() => res.redirect('back'))
      })
      .catch(err => res.send(err))
  },
  likeRestaurant: (req, res) => {
    return Like.create({
      RestaurantId: req.params.restaurantId,
      UserId: helpers.getUser(req).id
    })
      .then(() => res.redirect('back'))
      .catch(err => res.send(err))
  },
  unlikeRestaurant: (req, res) => {
    return Like.findOne({
      where: {
        RestaurantId: req.params.restaurantId,
        UserId: helpers.getUser(req).id
      }
    })
      .then(like => {
        like.destroy()
          .then(() => res.redirect('back'))
      })
      .catch(err => res.send(err))
  },
  getTopUsers: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: helpers.getUser(req).Followees.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        const loginId = helpers.getUser(req).id
        return res.render('topUsers', { users, loginId })
      })
      .catch(err => res.send(err))
  },
  followUser: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followeeId: req.params.userId
    })
      .then(() => res.redirect('/users/top'))
      .catch(err => res.send(err))
  },
  unfollowUser: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followeeId: req.params.userId
      }
    })
      .then(followship => {
        followship.destroy()
          .then(() => res.redirect('back'))
      })
      .catch(err => res.send(err))
  },
}

module.exports = userController