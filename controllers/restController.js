const helper = require('../_helpers')

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
    let CategoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.CategoryId) {
      CategoryId = Number(req.query.CategoryId)
      whereQuery.CategoryId = CategoryId
    }

    Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((_, i) => i + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(item => item.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(item => item.id).includes(r.id)
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories,
          CategoryId,
          page,
          totalPage,
          prev,
          next
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: User }
      ]
    }).then(restaurant => {
      restaurant.viewCounts = restaurant.viewCounts + 1
      restaurant.save().then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helper.getUser(req).id)
        const isLiked = restaurant.LikedUsers.map(item => item.id).includes(helper.getUser(req).id)
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
    })
  },

  getFeeds: (req, res) => {
    Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: Category
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Restaurant, User]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', { restaurants, comments })
    })
  },

  getDashboard: (req, res) => {
    const RestaurantId = req.params.id
    Promise.all([
      Restaurant.findByPk(RestaurantId, {
        raw: true,
        nest: true,
        include: Category
      }),
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { RestaurantId },
        include: Restaurant
      })
    ]).then(([restaurant, comments]) => {
      const countOfComments = comments.count
      return res.render('dashboard', { restaurant, countOfComments })
    })
  },

  getTop10Rest: (req, res) => {
    Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    }).then(restaurants => {
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        FavoriteCount: r.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map(item => item.id).includes(r.id)
      }))
      restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount)
      restaurants = restaurants.slice(0, 10)
      return res.render('top10Rest', { restaurants })
    })
  }
}
module.exports = restController
