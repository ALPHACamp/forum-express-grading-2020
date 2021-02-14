const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const helpers = require('../_helpers')
const pageLimit = 9 // 一頁限九筆資料
const restControllers = {
  getRestaurants: (req, res) => {
    let offset = 0 // 分頁的偏移量
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) { // 如果有點按頁面
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset, limit: pageLimit })
      .then(result => {  // 使用 findAndCountAll 會得到 count(資料量) 和 rows(餐廳資料集合)
        const page = Number(req.query.page) || 1  // 現在的頁面
        const pages = Math.ceil(result.count / pageLimit)  // 無條件進位，算出共會有多少分頁
        const totalPages = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1 // 前一頁
        const next = page + 1 > pages ? pages : page + 1 // 下一頁
        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id), //用 Array 的 includes 方法進行比對，最後會回傳布林值。看看現在這間餐廳是不是有被使用者收藏
          isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
        }))
        Category.findAll({ raw: true, nest: true })
          .then(categories => res.render('restaurants', { restaurants: data, categories, categoryId, totalPages, next, prev }))
      })
  },
  getRestaurant: (req, res) => {
    const userId = helpers.getUser(req).id
    Restaurant.findByPk(req.params.id, { include: [Category, { model: User, as: 'LikedUsers' }, { model: User, as: 'FavoritedUsers' }, { model: Comment, include: [User] }] })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(userId)
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(userId)
        restaurant.increment('viewCounts')
          .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked }))
      })
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({ limit: 10, raw: true, nest: true, order: [['createdAt', 'DESC']], include: [Category] }),
      Comment.findAll({ limit: 10, raw: true, nest: true, order: [['createdAt', 'DESC']], include: [User, Restaurant] })
    ]).then(([restaurants, comments]) => res.render('feeds', { restaurants, comments }))
  },
  goDashboard: (req, res) => {
    return Promise.all([Comment.findAndCountAll({ where: { RestaurantId: req.params.id } }),
    Restaurant.findByPk(req.params.id, { include: [Category] })])
      .then(([comments, restaurant]) => res.render('dashboard', { restaurant: restaurant.toJSON(), count: comments.count, viewCounts: restaurant.toJSON().viewCounts }))
  },
  getTopRestaurant: (req, res) => {
    Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }] })
      .then(restaurants => {
        restaurants = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50),
          FavoriteCount: restaurant.FavoritedUsers.length,
          isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(restaurant.id),
          isLiked: helpers.getUser(req).LikedRestaurants.map(d => d.id).includes(restaurant.id)
        }))
        restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount).slice(0, 11)
        return res.render('topRestaurant', { restaurants })
      })
  }
}

module.exports = restControllers
