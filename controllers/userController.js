const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.flash('err_msg', '密碼與確認密碼不符')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email } }).then((user) => {
      if (user) {
        req.flash('err_msg', '此信箱已註冊')
        return res.redirect('/signup')
      }
      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      return User
        .create({ name, email, password: hashPassword })
        .then(() => {
          req.flash('success_msg', '你已成功註冊')
          res.redirect('/signin')
        })
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    console.log('correct')
    req.flash('success_msg', '成功登入')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.logout()
    req.flash('success_msg', '成功登出')
    return res.redirect('/signin')
  }
}

module.exports = userController