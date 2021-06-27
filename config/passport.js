const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  async (req, username, password, cb) => {
    try {
      let user = await User.findOne({ where: { email: req.body.email } })
      if (!user) {
        return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      }
      return cb(null, user)
    } catch (err) {
      return cb(null, false, req.flash('error_messages', err))
    }
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON()) // 此處與影片示範不同
  } catch (err) {
    return cb(null, false, req.flash('error_messages', err))
  }
})

module.exports = passport