const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (Number(req.query.page) - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: [Category],
      where: whereQuery,
      offset: offset,
      limit: pageLimit,
      raw: true,
      nest: true
    })
      .then(restaurants => {
        //page settings
        const page = Number(req.query.page) || 1
        const maxPage = Math.ceil(restaurants.count / pageLimit)
        const pageList = Array.from({ length: maxPage }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > maxPage ? maxPage : page + 1

        const data = restaurants.rows.map(r => ({
          ...r.dataValues,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name,
          image: r.image,
          isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: helpers.getUser(req).LikedRestaurants.map(d => d.id).includes(r.id)
        }))
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId,
              page,
              pageList,
              prev,
              next
            })
          })
      })
      .catch(err => res.send(err))
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map((d, i) => d.id).includes(helpers.getUser(req).id)
        const isLiked = restaurant.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        return restaurant.increment('viewCounts', { by: 1 })
          .then(() => {
            return res.render('restaurant', {
              restaurant: restaurant.toJSON(),
              isFavorited,
              isLiked
            })
          })
      })
      .catch(err => res.send(err))
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          comments,
          restaurants
        })
      })
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment
      ]
    })
      .then(restaurant => {
        if (!restaurant) {
          req.flash('warning_msg', '無此餐廳！')
          return res.redirect('/restaurants')
        }
        res.render('dashBoard', {
          restaurant: restaurant.toJSON(),
        })
      })
  },
  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM favorites AS favorite
              WHERE
                favorite.RestaurantId = Restaurant.id
                )`),
            'favoriteCount',
          ],
        ]
      },
      include: { model: User, as: 'FavoritedUsers' },
      order: [
        [sequelize.literal('favoriteCount'), 'DESC']
      ],
      limit: 10,
    })
      .then(restaurants => {
        restaurants = restaurants.map(r => ({
          ...r.dataValues,
          isFavorite: r.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        }))
        res.render('topRestaurants', { restaurants })
      })
      .catch(err => res.send(err))
  }
}

module.exports = restController