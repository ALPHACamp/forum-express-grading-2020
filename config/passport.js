const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
  User
    .findOne({ where: { email } })
    .then(user => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, req.flash('err_msg', '帳號或密碼輸入錯誤'))
      }
      return done(null, user)
    })
    .catch(err => done(err, null))
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  User
    .findByPk(id)
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
    .catch(err => done(err, null))
})

module.exports = passport