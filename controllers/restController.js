const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10
const helper = require('../_helpers')

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
    Restaurant.findAndCountAll(({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })).then(result => {

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: helper.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: helper.getUser(req).LikedRestaurants.map(d => d.id).includes(r.id)
      }))

      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {

        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {

      restaurant.viewCounts = restaurant.viewCounts + 1
      restaurant.save()
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helper.getUser(req).id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(helper.getUser(req).id)

      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited,
        isLiked: isLiked
      })
    })
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

  getDashboard: (req, res) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        where: { RestaurantId: req.params.id }
      }),
    ]).then(([restaunant, comments]) => {

      return res.render('dashboard', {
        restaurant: restaunant,
        comments: comments.length
      })
    })
  },

  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    }).then(restaurants => {

      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: helper.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
        FollowerCount: r.FavoritedUsers.length
      }))

      restaurants = restaurants.sort((a, b) => b.FollowerCount - a.FollowerCount)
      restaurants = restaurants.slice(0, 10)
      return res.render('topRestaurant', { restaurants })
    })

  }
}

module.exports = restController