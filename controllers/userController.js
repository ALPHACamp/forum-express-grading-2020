const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Category = db.category
const sequelize = db.sequelize

const userController = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res) => {
    // confirm password
    if(req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({where: {email: req.body.email}}).then(user => {
        if(user){
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

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      nest: true,
      include: { model: Comment, nest: true, include: Restaurant, attributes: ['RestaurantId'] },
      group: ['RestaurantId']
    })
    .then(async user => {
      const comment_count = await Comment.count({ where: { UserId: req.params.id } })
      const restaurant_count = await Comment.count({ 
          where: { UserId: req.params.id },
          distinct: true,
          col: 'RestaurantId'
       })
       console.log(user.toJSON())
      return res.render('user', { user: user.toJSON(), comment_count, restaurant_count})
    })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => res.render('edit', { user: user.toJSON() })) 
  },

  putUser: async (req, res) => {
    const { file } = req
    let img = null
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      const uploadImage = new Promise((resolve, rej) => {
        imgur.upload(file.path, (err, image) => {
          img = image
          resolve()
        })
      })
      await uploadImage.then(() => console.log('uploaded'))
    }
    return User.findByPk(req.params.id)
      .then(user => {
        user.update({
          ...req.body,
          image: file && img ? img.data.link : req.body.image
        }).then(() => {
          req.flash('success_messages', 'Your profile is updated.')
          res.redirect(`/users/${req.params.id}`)
        })
      }) 
  }

}

module.exports = userController