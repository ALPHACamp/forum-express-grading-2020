const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const helpers = require('../_helpers')
// req.user -> helpers.getUser(req)
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0 // 偏移量,從第0筆開始
    const whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // 定義頁數資料變數
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? 1 : page + 1

      // 將restaurants 內部資料展開一一傳入data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLike: helpers.getUser(req).LikeRestaurants.map(d => d.id).includes(r.id)
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
        { model: User, as: 'LikeUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      const isLike = restaurant.LikeUsers.map(d => d.id).includes(helpers.getUser(req).id)
      restaurant.increment('viewCounts', { by: 1 } )
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLike
      })
    })  .catch(err => console.log(err))
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
        restaurants,
        comments
      })
    })
  },

  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment
      ]
    }).then(restaurant => {
      return res.render('dashboard', {
        restaurant: restaurant.toJSON()
      })
    })
  },

  getTopRestaurant: async (req, res) => {
    try {
      const rawRestaurants = await Restaurant.findAll({
        include: [
          { model: User, as: 'FavoritedUsers' }
        ],
        limit: 10
      })
      const topRestaurants = await rawRestaurants.map(restaurant => ({
        ...restaurant.dataValues,
        FavoritedCount: restaurant.FavoritedUsers.length,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(favorites => favorites.id).includes(restaurant.id)
      }))
      topRestaurants.sort((a, b) => b.FavoritedCount - a.FavoritedCount)
      return res.render('topRestaurant', { restaurants: topRestaurants })
    } catch (error) {
      return res.redirect('back')
    }
  }
}
module.exports = restController
