const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true    // for flash msg
}, (req, username, password, cb) => {
  User.findOne({ where: { email: username } })
    .then(user => {
      if (!user) {
        return cb(null, false, req.flash('error_msg', ['帳號或密碼輸入錯誤']))
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return cb(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤'))
      }
      return cb(null, user)   // if success, pass on user info
    })
    .catch(err => console.log(err))
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)  // only pass on user.id to save space since the user object is stored in the browser session. if we have the id, we are able to get the entire user object
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
    .catch(err => console.log(err))
})

module.exports = passport
