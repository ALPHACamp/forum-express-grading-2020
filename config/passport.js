const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('warning_msg', '帳號或密碼輸入錯誤'))
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('warning_msg', '帳號或密碼輸入錯誤！'))
        return cb(null, user)
      })
      .catch(err => console.log(err))
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followees' },
      { model: User, as: 'Followers' }
    ]
  })
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
    .catch(err => console.log(err))
})

module.exports = passport