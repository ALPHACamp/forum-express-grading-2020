const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite } = require('../models')
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientID(IMGUR_CLIENT_ID);

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
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

  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include:[{ model: Comment, include: Restaurant }]
      })
      if (!user) throw new Error("user isn't exist !!")

      const restaurantInfo = new Map()
      user.toJSON().Comments.forEach(r => {
        const id = r.RestaurantId
        if (restaurantInfo.has(id)) {
          restaurantInfo.get(id).count++
        } else {
          restaurantInfo.set(id, { RestaurantId: id, name: r.Restaurant.name, image: r.Restaurant.image, count: 1 })
        }
      })
      console.log(restaurantInfo)
      res.render('profile', { user: user.toJSON(), restaurants: [...restaurantInfo.values()] })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('warning_msg', '你只能修改自己的 profile!!')
      return res.redirect(`/users/${req.user.id}`)
    }
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("user isn't exist !!")
      res.render('editProfile', { user: user.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putUser: async (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('warning_msg', '你只能修改自己的 profile!!')
      return res.redirect(`/users/${req.user.id}`)
    }
    if (!req.body.name) {
      req.flash('warning_msg', 'Please enter user name.')
      return res.redirect('back')
    }

    const { file } = req

    try {
      const user = await User.findByPk(req.params.id)

      if (file) {
        imgur.upload(file.path, async (err, img) => {
          if (err) throw new Error('image not found.')
          await user.update({
            name: req.body.name,
            image: file ? img.data.link : user.image
          })
        })
        req.flash('success_msgs', 'user was successfully updated')
        return res.redirect(`/users/${req.params.id}`)
      } else {
        await user.update({
          name: req.body.name,
          image: user.image
        })
        req.flash('success_msgs', 'user was successfully updated')
        return res.redirect(`/users/${req.params.id}`)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController
