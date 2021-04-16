/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      User
        .findOne({ where: { email: username } })
        .then(user => {
          if (!user) {
            return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
          }
          return bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
              }
              return cb(null, user)
            })
        })
        .catch(err => cb(err, false))
    }
  ))

  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })

  passport.deserializeUser((id, cb) => {
    User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
  })

  passport.use(new JwtStrategy(
    jwtOptions,
    (jwt_payload, next) => {
      User.findByPk(jwt_payload.id, {
        include: [
          { model: db.Restaurant, as: 'FavoritedRestaurants' },
          { model: db.Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }).then(user => {
        if (!user) return next(null, false)
        return next(null, user)
      })
    }))
}
