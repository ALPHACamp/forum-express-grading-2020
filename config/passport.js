const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
passport.use(new LocalStrategy({
  usernameField: 'email',
  passportField: 'password',
  passReqToCallback: true
},
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        return cb(null, user)
      })
  }
))
passport.serializeUser((user, cb) => cb(null, user.id))
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' },
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' }]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport