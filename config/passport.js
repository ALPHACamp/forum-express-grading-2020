const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

module.exports = app => {
  //init
  app.use(passport.initialize())
  app.use(passport.session())

  //local strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        let user = await User.findOne({ where: { email } })
        if (!user) {
          return done(null, false, req.flash('error_msg', '此帳號未註冊'))
        }
        user = user.toJSON()
        //password compare
        if (!await bcrypt.compare(password, user.password)) {
          return done(null, false, req.flash('error_msg', '密碼不符'))
        }
        return done(null, user)
      } catch (e) {
        return done(e, false)
      }
    }
  ))

  //序列化
  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  //去序列化
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findByPk(id)
      return done(null, user.toJSON())
    } catch (e) {
      return done(e, false)
    }
  })
}