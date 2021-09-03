const db = require('../models')
const Comment = db.Comment
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then((results) => {
      const page = req.query.page || 1
      const pages = Math.ceil(results.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      )
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = results.rows.map((r) => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name
      }))

      Category.findAll({
        raw: true,
        nest: true
      }).then((categories) => {
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

      // return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: [User] }]
    }).then((restaurant) => {
      console.log(restaurant.Comments[0].dataValues)
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
  }
}

module.exports = restController
