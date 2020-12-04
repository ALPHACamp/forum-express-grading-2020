const passport = require('passport')
const LocalStrategy = require('passport-local')
// const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant } = db



passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email: email } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }
    ]
  }).then(user => {
    user = user.toJSON() // 此處與影片示範不同
    return cb(null, user)
  })
})

module.exports = passport