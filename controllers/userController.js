const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const userController = {
  // 渲染 signup 畫面
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  // 處理註冊行為
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    // 確認密碼和密碼不同
    if ( password !== passwordCheck) {
      req.flash('warning_msg', '密碼和密碼確認不相符!')
      return res.redirect('/signup')
    }

    User.findOne({ where: {email: email} }).then(user => {
      if (user) {
        req.flash('warning_msg', '此信箱已註冊!')
        return res.redirect('/signup')
      } else {
        User.create({
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          // 註冊成功
          req.flash('success_msg', '註冊成功!')
          return res.redirect('/signin')
        })
      }
    })
  },

  // signInPage
  signInPage: (req, res) => {
    res.render('signin')
  },
  // signIn
  signIn: (req, res) => {
    req.flash('success_msg', '成功登入!')
    return res.redirect('/restaurants')
  },
  // logOut
  logOut: (req, res) => {
    req.flash('success_msg', '成功登出!')
    req.logout()
    return res.redirect('/signin')
  }, 


  // profile page

  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profile', { user: user.toJSON() } )
      })
  },

  // profile edit page
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profileEdit', { user: user.toJSON() })
      })
  }, 

  // profile update page
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '使用者名稱為必填資訊！')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(`Error: ${err}`)
        return User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            image: file ? img.data.link : user.image
          }).then(() => {
            req.flash('success_messages', '已成功修改使用者資料')
            res.redirect(`/users/${req.params.id}`)
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          image: user.image
        })
          .then(() => {
            req.flash('success_messages', '已成功修改使用者資料')
            res.redirect(`/users/${req.params.id}`)
          })
          .catch(err => console.error(err))
      })
    }

  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({ where: { RestaurantId: req.params.restaurantId } })
      .then(favorite => {
        return favorite.destroy()
      })
      .then(() => {
        return res.redirect('back')
      })
  }
}

module.exports = userController