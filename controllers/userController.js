const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
// const { getUser } = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.flash('error_msg', '密碼與確認密碼不一致')
      return res.redirect('/users/signUp')
    }
    try {
      let user = await User.findOne({ where: { email } })
      if (user) {
        req.flash('error_msg', '此帳號已被註冊')
        return res.redirect('/users/signUp')
      }
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      req.flash('success_msg', '成功註冊帳號!')
      return res.redirect('/signIn')
    } catch (e) {
      console.warn(e)
    }

  },

  signInPage: (req, res) => {
    return res.render('signIn')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/users/signIn')
  },

  //profile
  getUser: async (req, res) => {
    const user_id = req.params.id

    try {
      let user = await User.findByPk(user_id, {
        include: [
          { model: Comment, include: [Restaurant] }
        ]
      })
      user = user.toJSON()
      return res.render('profile/index', { user, comments: user.Comments, commentLength: user.Comments.length })
    } catch (e) {
      console.warn(e)
    }
  },
  editUser: async (req, res) => {
    const user_id = req.params.id
    try {
      let user = await User.findByPk(user_id)

      return res.render('profile/edit', { user: user.toJSON() })
    } catch (e) {
      console.warn(e)
    }
  },
  putUser: async (req, res) => {
    const user_id = req.params.id
    const { name } = req.body
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          let user = await User.findByPk(user_id)
          await user.update({
            name,
            image: file ? img.data.link : user.image
          })

          return res.redirect(`/users/${user_id}`)
        })
      } else {
        let user = await User.findByPk(user_id)
        await user.update({
          name,
          image: user.image
        })
        return res.redirect(`/users/${user_id}`)
      }
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = userController