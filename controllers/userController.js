const fs = require('fs')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const defaultProfilePic = 'https://i.stack.imgur.com/34AD2.jpg'

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            image: file ? `/upload/${file.originalname}` : null
          }).then((user) => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        })
      })
    }

    else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            image: null
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  // signUp: (req, res) => {
  //   // confirm password
  //   if (req.body.passwordCheck !== req.body.password) {
  //     req.flash('error_messages', '兩次密碼輸入不同！')
  //     return res.redirect('/signup')
  //   } else {
  //     // confirm unique user
  //     User.findOne({ where: { email: req.body.email } }).then(user => {
  //       if (user) {
  //         req.flash('error_messages', '信箱重複！')
  //         return res.redirect('/signup')
  //       } else {
  //         User.create({
  //           name: req.body.name,
  //           email: req.body.email,
  //           password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
  //         }).then(user => {
  //           req.flash('success_messages', '成功註冊帳號！')
  //           return res.redirect('/signin')
  //         })
  //       }
  //     })
  //   }
  // },

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
  getUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {

      return res.render('userProfile', {
        user: user.toJSON()
      })
    })
  },

  editUser: (req, res) => {
    User.findAll({
      raw: true,
      nest: true
    }).then(users => {
      return User.findByPk(req.params.id).then(user => {
        return res.render(`editProfile`, {
          user: user.toJSON(),
        })
      })
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              image: file ? img.data.link : restaurant.image
            }).then((user) => {
              req.flash('success_messages', '個人資料更新成功！')
              return res.redirect(`/users/${user.id}`)
            })
          })
      })
    }

    else {
      // confirm unique user
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          image: defaultProfilePic
        }).then(user => {
          req.flash('success_messages', '個人資料更新成功！')
          return res.redirect(`/users/${user.id}`)
        })

      })
    }
  },

}

module.exports = userController