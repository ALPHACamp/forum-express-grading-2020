const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Category = db.category
const sequelize = db.sequelize
const Favorite = db.Favorite
const Like = db.Like
const helpers = require('../_helpers')

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
    return User.findByPk(req.params.id)
    .then(async user => {
      const comments = await Comment.findAll({ 
        where: { UserId: req.params.id },
        raw: true, 
        nest: true, 
        include: Restaurant,
        attributes: ['RestaurantId'],
        group: ['RestaurantId']
      }).then(comments => comments)
      const comment_count = await Comment.count({ where: { UserId: req.params.id } })
      const restaurant_count = await Comment.count({ 
          where: { UserId: req.params.id },
          distinct: true,
          col: 'RestaurantId'
       })
      return res.render('user', { user: user.toJSON(), comments, comment_count, restaurant_count})
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
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(favorite => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((favorite) => {
            return res.redirect('back')
          })
      })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(like => {
      return res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      like.destroy()
      .then(like => {
        return res.redirect('back')
      })
    })
  },

  getTopUser: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  }
}

module.exports = userController