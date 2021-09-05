const db = require('../models/index')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

const restController = {

  getRestaurants: async (req, res) => {
    try {
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
      const results = await Restaurant.findAndCountAll({
        include: Category,
        where: whereQuery,
        offset,
        limit: pageLimit
      })
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(results.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const data = results.rows.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.description.substring(0, 50),
        categoryName: restaurant.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(data => data.id).includes(restaurant.id) // if include will true!
      }))
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        page,
        totalPage,
        prev,
        next
      })
    } catch (err) {
      console.warn(err)
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id,
      {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }]
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id) // 找出收藏此餐廳的 user
        restaurant.increment('viewCounts')
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited
        })
      })
  },

  getFeeds: (req, res) => {
    // 改寫Promise.all
    return Promise.all([
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
        include: [User, Restaurant]
      })
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', { restaurants, comments })
      })
  },

  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id,
      { include: [Category, Comment] })
      .then(restaurant => {
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
  }
}

module.exports = restController
