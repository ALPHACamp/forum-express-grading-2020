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
        categoryId: categoryId
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
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      return console.warn(err)
    }
  }
}

module.exports = restController