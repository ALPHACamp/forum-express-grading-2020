//const { DESCRIBE } = require('sequelize/types/lib/query-types')
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

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
      raw: true,
      nest: true,
      include: [Category],
      where: whereQuery, // 篩選條件
      offset: offset,
      limit: pageLimit
    })
      .then(restaurants => {
        // pagination data
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(restaurants.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1 
        const next = page + 1 > pages ? pages : page + 1 

        restaurants.rows.forEach(restaurant => {
          restaurant.description= restaurant.description.substring(0, 50)
          restaurant.categoryName = restaurant.Category.name
        })

        Category.findAll({
          raw: true,
          nest: true
        })
          .then(categories => {
            return res.render('restaurants', { 
              restaurants: restaurants.rows, 
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
      include: [Category, { model: Comment, include:[User] }] 
    })
      .then(restaurant => {
        restaurant.increment({
          views: +1
        })
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
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
    
  }
}

module.exports = restController

// restConrtroller 是 物件
// getRestaurants 是 物件屬性
// gerRestaurants 是 函式，回傳渲染restaurants樣板