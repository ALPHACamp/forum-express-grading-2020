const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10
const helpers = require('../_helpers')

const resController = {
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
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    }).then(results => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(results.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : pages + 1
      // clean up restaurant data
      const data = results.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.length > 0 ? helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id) : false,
        isLiked: helpers.getUser(req).LikedRestaurants.length > 0 ? helpers.getUser(req).LikedRestaurants.map(d => d.id).includes(r.id) : false
      }))
      
      Category.findAll({ 
        raw: true,
        nest: true
     }).then(categories => {  
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page,
          totalPage,
          prev,
          next
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
      }).then(async restaurant => {
        const isFavorited = restaurant.FavoritedUsers.length > 0 ? restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id) : false// 找出收藏此餐廳的 user
        const isLiked = restaurant.LikedUsers.length > 0 ? restaurant.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id) : false
        if (restaurant) restaurant = await restaurant.increment('viewCounts', { by: 1 })
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
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
      Comment.count({ where: { RestaurantId: req.params.id } }),
      Restaurant.findByPk(req.params.id, {
        nest: true,
        include: [Category]
      })
    ]).then(([commentCount, restaurant]) => {
      console.log('before increment:', restaurant.dataValues) //can't access without dataValues
      console.log(restaurant.name)
      res.render('dashboard', { commentCount, restaurant: restaurant.toJSON() })
    })
  },

  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      nest: true,
      include: [{ model: User, as: 'FavoritedUsers' }],
      limit: 10,
      offset: 0
    }).then(restaurants => {

      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        UserCount: r.FavoritedUsers.length,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
      })).sort((a, b) => b.UserCount - a.UserCount)

      res.render('topRestaurants', { restaurants })
    })
  }
}

module.exports = resController