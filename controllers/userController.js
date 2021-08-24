const bcrypt = require('bcryptjs')
const db = require('../models/index')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    // confirm password
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name,
              email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => res.redirect('/signIn'))
          }
        })
    }
  }
}

module.exports = userController
