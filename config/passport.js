const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const db =require('../models')
const User = db.User

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({where: {email: username}})
        .then( user => {
            if(!user) return done(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤'))
            if(!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤'))
            return done(null, user)
        })
}))
passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
    User.findByPk(id)
        .then(user => {
            return done(null, user.toJSON())
        })
})

module.exports = passport