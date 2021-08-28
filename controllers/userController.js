const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const userData = req.body
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }
    User.create({ ...userData})
      .then(user => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => {
        req.flash('error_messages', `${err.errors[0].message}`)
        return res.redirect('/signup')
      })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, { raw: true })
      .then(user => res.render('profile', { user }))
      .catch(err => console.log(err))
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id, { raw: true })
      .then(user => res.render('editProfile', { user }))
      .catch(err => console.log(err))
  },

  putUser: (req, res) => {
    const userId = Number(req.params.id)
    const updateData = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        updateData.image = img.data.link
        return User.findByPk(userId)
          .then(user => {
            user.update({ ...updateData })
              .then(user => res.redirect(`/users/${userId}`))
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      })
    } else {
      return User.findByPk(userId)
        .then(user => {
          user.update({ ...updateData })
            .then(user => res.redirect(`/users/${userId}`))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
  }
}

module.exports = userController