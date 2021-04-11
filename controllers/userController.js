const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const { getUser } = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {

  // 註冊 get
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  // 註冊 post
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (!name || !email || !password || !passwordCheck) {
      console.log('error_messages : 全部都要輸入')
      req.flash('error_messages', '全部都需要輸入')
      return res.render('signup', { name, email })
    }
    if (!email.match(/.+@.+\..+/)) {
      console.log('error_messages : 請輸入正確信箱')
      req.flash('error_messages', '請輸入正確信箱')
      return res.render('signup', { name, email })
    }
    if (!password.match(/[_a-zA-Z0-9_]{8,}/)) {
      console.log('error_messages : 請輸入八位以上英文或數字')
      req.flash('error_messages', '請輸入八位以上英文或數字')
      return res.render('signup', { name, email })
    }
    if (passwordCheck !== password) {
      console.log('error_messages : 密碼與確認密碼不相符！')
      req.flash('error_messages', '密碼與確認密碼不相符！')
      return res.redirect('/signup')
    }
    const user = User.findOne({ where: { email } })
    if (user) {
      req.flash('error_messages', '信箱重複！')
      return res.redirect('/signup')
    }
    User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
    req.flash('success_messages', '成功註冊帳號！')
    return res.redirect('/signin')
  },

  // 登入 get
  signInPage: (req, res) => {
    return res.render('signin')
  },

  // 登入 post
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    getUser(req).isAdmin ? res.redirect('/admin/restaurants') : res.redirect('/restaurants')
  },

  // 登出 get
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  // 取得 profile
  getUser: async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findByPk(id, { raw: true })
      const comment = await Comment.findAll(
        { raw: true, nest: true, where: { userId: id }, include: Restaurant }
      )
      const count = comment.length
      return res.render('users/profile', { user, count, comment })
    } catch (e) {
      console.log(e)
    }
  },

  // 編輯 profile
  editUser: async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findByPk(id, { raw: true })
      return res.render('users/edit', { user })
    } catch (e) {
      console.log(e)
    }
  },

  // 更新 profile
  putUser: (req, res) => {
    const id = req.params.id
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      // eslint-disable-next-line node/handle-callback-err
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then((user) => {
            user.update({
              ...user,
              image: file ? img.data.link : user.image
            })
          })
          .then(() => {
            req.flash('success_messages', '使用者更新成功')
            res.redirect(`/users/${id}`)
          })
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({
            ...user,
            image: user.image
          })
        })
        .then(() => {
          req.flash('success_messages', '使用者更新成功')
          res.redirect(`/users/${id}`)
        })
    }
  }
}

module.exports = userController
