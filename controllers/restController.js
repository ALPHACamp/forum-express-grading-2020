const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
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

      const results = await Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit })
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(results.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const data = results.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50), // 當 key 重覆時，會以後面出現的為準
        categoryName: r.Category.name,
        categoryId: categoryId,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      const categories = await Category.findAll({ raw: true, nest: true })

      return res.render('restaurants', {
        restaurants: data, categories: categories, categoryId: categoryId,
        page: page, totalPage: totalPage, prev: prev, next: next
      })
    } catch (err) {
      return console.warn(err)
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }, { model: Comment, include: [User] }] })
      await restaurant.increment('viewCounts')
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)

      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited: isFavorited, isLiked: isLiked })
    } catch (err) {
      return console.warn(err)
    }
  },

  getFeeds: (req, res) => {
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
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },

  getDashboard: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] }
        ]
      })
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      return console.warn(err)
    }
  },

  getTopRestaurant: async (req, res) => {
    try {
      let restaurants = await Restaurant.findAll({
        order: [['createdAt', 'DESC']],
        include: [Category, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }]
      })
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        // 計算追蹤者人數
        FavoritedUsers: restaurant.FavoritedUsers.length,
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id),
        isLiked: restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      }))
      // 依追蹤者人數排序清單
      restaurants = restaurants.sort((a, b) => b.FavoritedUsers - a.FavoritedUsers)
      restaurants = restaurants.slice(0, 10)
      return res.render('topRestaurants', { restaurants: restaurants })
    } catch (err) {
      return console.warn(err)
    }
  },
}

module.exports = restController