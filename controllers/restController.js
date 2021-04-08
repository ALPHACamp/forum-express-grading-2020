const { Restaurant, Category, Comment, User } = require('../models')

const pageLimit = 10

const restController = {
  getRestaurants: async (req, res) => {
    try {
      let whereQuery = {}
      let { categoryId, page } = req.query

      //pagination
      page = page ? Number(page) : 1
      let offset = (page - 1) * pageLimit

      //category
      categoryId = categoryId ? Number(categoryId) : ''
      categoryId ? whereQuery['CategoryId'] = categoryId : ''

      let result = await Restaurant.findAndCountAll({ include: [Category], where: whereQuery, offset, limit: pageLimit })
      //pagination
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.description.substring(0, 50),
        categoryName: r.Category.name
      }))

      let categories = await Category.findAll({ raw: true, nest: true })

      return res.render('restaurants', { restaurants: data, categories, categoryId, page, totalPage, prev, next })
    } catch (e) {
      console.warn(e)
    }
  },
  getRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, {
        include: [
          Category,
          { model: Comment, include: [User] }
        ]
      })
      return res.render('detail', { restaurant: restaurant.toJSON() })
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = restController