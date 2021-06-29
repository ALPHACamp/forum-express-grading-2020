const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_msg', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_msg', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10, null)
          }).then(user => {
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInpage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('signin')
  },

  //TODO:
  getUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('profile', { user: user.toJSON() })
    })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      console.log(user.toJSON())
      return res.render('editProfile', { user: user.toJSON() })
    })
  },

  putUser: (req, res) => {

  }

}

module.exports = userController