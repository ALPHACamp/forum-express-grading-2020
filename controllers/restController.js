const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset, limit: pageLimit })
      .then(restaurants => {
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(restaurants.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 > 0? page - 1: 1
        const next = page + 1 > pages? pages: page + 1
        restaurants = restaurants.rows.map(item => ({
          ...item.dataValues,
          description: item.dataValues.description.substring(0, 50),
          categoryName: item.Category.name
        }))
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
          })
      })
      .catch(err => console.log(err))
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { 
      include: [
        Category,
        { model: Comment, include: [User] }
      ]})
      .then(restaurant => {
        restaurant = restaurant.toJSON()
        return res.render('restaurant', { restaurant })
      })
      .catch(err => console.log(err))
  }
}

module.exports = restController