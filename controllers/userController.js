
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '確認密碼不相符!')
      return res.render('signup', { name, email, password, passwordCheck})
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此信箱已被註冊')
            return res.render('signup', { name, email, password, passwordCheck })
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(
                user => {
                  return res.redirect('/signin')
                }
              )
          }
        })
    }
  }
}

module.exports = userController