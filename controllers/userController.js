const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    try {
      if (req.body.passwordCheck !== req.body.password) {
        req.flash('error_messages', '兩次密碼輸入不同！')
        return res.redirect('/signup')
      } else {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          })

          req.flash('success_messages', '成功註冊帳號！')
          return res.redirect('/signin')
        }
      }
    } catch (err) {
      return console.warn(err)
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, { include: [{ model: Comment, include: [Restaurant] }] })
      let isSelf = false

      if (Number(req.params.id) === req.user.id) {
        isSelf = true
      }
      return res.render('profile', { profileUser: user.toJSON(), isSelf })
    } catch (err) {
      return console.warn(err)
    }

  },

  editUser: (req, res) => {
    if (Number(req.params.id) !== req.user.id) {
      req.flash('error_messages', '只能修改自己的 Profile！')
      return res.redirect(`/users/${req.params.id}`)
    } else {
      return res.render('edit', { profileUser: req.user })
    }
  },

  putUser: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, async (err, img) => {
          const user = await User.findByPk(req.params.id)
          await user.update({
            name: req.body.name,
            image: file ? img.data.link : user.toJSON().image
          })
          req.flash('success_messages', 'restaurant was successfully to update')
          res.redirect(`/users/${req.params.id}`)
        })
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({
          name: req.body.name,
          image: user.toJSON().image
        })
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect(`/users/${req.params.id}`)
      }
    } catch (err) {
      return console.warn(err)
    }
  }
}

module.exports = userController