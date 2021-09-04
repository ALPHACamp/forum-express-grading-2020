const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

passport.use(new LocalStrategy(
  // 1. 客製化選項
  {
    usernameField: 'email',
    passwordField: 'password',
    // 用於取得request => be used for showing flash
    passReqToCallback: true
  },
  // 2. 登入認證程序
  (req, username, password, cb) => {
    User.findOne({ where: {email: username} }).then(user => {
      if (!user) return cb(null, false, req.flash('warning_msg', '帳號或密碼輸入錯誤!'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('warning_msg', '密碼錯誤!'))
      return cb(null, user)
    })
  }
))

// 3. 序列化
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
// 4. 反序列化
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [ // 讓req.user包含Restaurant資料庫的favorite&like外鍵資料
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants'},
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers'}
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport