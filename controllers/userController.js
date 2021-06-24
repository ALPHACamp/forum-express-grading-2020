const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const fs = require('fs')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_msg', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_msg', '信箱重複！')
            return res.redirect('/signup')
          }
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_msg', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findOne({ where: { id: req.params.id } })
      .then(user => {
        res.render('user', { user: user.toJSON() })
      })
  },

  editUser: (req, res) => {
    User.findOne({ where: { id: req.params.id } })
      .then(user => {
        res.render('editUser', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', 'please enter your name')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findOne({ where: { id: req.params.id } })
            .then((user) => {
              user.update({
                name: req.body.name,
                image: file ? `/upload/${file.originalname}` : user.image
              }).then((user) => {
                req.flash('success_msg', 'user was successfully to update')
                res.redirect(`/users/${user.id}`)
              })
            })
        })
      })
    } else {
      return User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          }).then((user) => {
            req.flash('success_msg', 'user was successfully to update')
            res.redirect(`/users/${user.id}`)
          })
        })
    }
  }
}

module.exports = userController