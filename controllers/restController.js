//const { DESCRIBE } = require('sequelize/types/lib/query-types')
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10
const topUserLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAndCountAll({ 
      include: [Category],
      where: whereQuery, // 篩選條件
      offset: offset,
      limit: pageLimit
    })
      .then(result => {
        // pagination data
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1 
        const next = page + 1 > pages ? pages : page + 1 

        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.dataValues.Category.name,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
        }))

        Category.findAll({
          raw: true,
          nest: true
        })
          .then(categories => {
            return res.render('restaurants', { 
              restaurants: data, 
              categories, 
              categoryId,
              page,
              totalPage,
              prev,
              next
           })
          })
      })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk( req.params.id, { 
      include: [Category, { model: Comment, include:[User] }, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers'}] 
    })
      .then(restaurant => {
        restaurant.increment({
          views: +1
        })
        const isFavorited = restaurant.FavoritedUsers.some(user => user.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(user => user.id === req.user.id)

        // restaurant.isFavorited = req.user.FavoritedRestaurants
        return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
  },

  getFeeds: (req, res) => {
    return Promise.all([ // 接受的參數是陣列
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Restaurant, User]
      })
    ])
      .then(([ restaurants, comments ]) => {
        return res.render('feeds', { restaurants, comments })
      })
  }, 
  getCounts: (req, res) => {
    let commentCounter = ''
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: [Category]
      }),
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { restaurantId: Number(req.params.id) },
      })
    ])
      .then(([restaurant, comment]) => {
        commentCounter = comment.count
        return res.render('dashboard', { commentCounter, restaurant: restaurant.toJSON() })
      })
  },
  getTopUsers: (req, res) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
            ...user.dataValues,
            FollowerCount: user.followers.length,
            isFollowed: req.user.followings.map(d => d.id).includes(user.id)
          }) 
        )
        users = users.sort((a, b) => { b.FollowerCount - a.FollowerCount })
        return res.render('topUsers', { users })
      }) 
  }
}

module.exports = restController

// restConrtroller 是 物件
// getRestaurants 是 物件屬性
// gerRestaurants 是 函式，回傳渲染restaurants樣板