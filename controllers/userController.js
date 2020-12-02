const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

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
    User.findByPk(UserId).then(user => {
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        include: Restaurant,
        where: { UserId }
      }).then(result => {
        const countOfComments = result.count || 0
        const restaurants = result.rows.map(comment => comment.Restaurant)
        const uniqueRests = Array.from(new Set(restaurants.map(item => item.id)))
          .map(id => restaurants.find(item => item.id === id))

        return res.render('profile', {
          user: req.user,
          profile: user.toJSON(),
          countOfComments,
          countOfRests: uniqueRests.length || 0,
          restaurants: uniqueRests
        })
      })
    })
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user =>
      res.render('profileEdit', { user: req.user, profile: user.toJSON() })
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
  }
}

module.exports = userController
