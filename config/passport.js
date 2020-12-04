const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

module.exports = app => {
  // init Passport
  app.use(passport.initialize())
  app.use(passport.session())

  // Set LocalStrategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ where: { email } }).then(user => {
      if (!user) return done(null, false, req.flash('error_messages', 'That email is not registered!'))
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_messages', 'Email or Password incorrect.'))
      return done(null, user.toJSON(), req.flash('success_messages', `Welcome, ${user.name}`))
    }).catch(err => done(err, null))
  }))

  // serialize & deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => done(null, user.toJSON()))
      .catch(err => done(err, null))
  })
}