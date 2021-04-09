const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {

  // 顯示全部餐廳
  getRestaurants: async (req, res) => {
    const id = req.query.categoryId
    const querystring = {}
    let categoryId = ''
    if (id) {
      categoryId = Number(id)
      querystring.CategoryId = categoryId
    }
    try {
      const restaurants = await Restaurant.findAll({ include: Category, where: querystring })
      const categories = await Category.findAll({ raw: true, nest: true })
      const data = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.substring(0, 50),
        categoryName: restaurant.Category.name
      }))
      return res.render('restaurants', { restaurants: data, categories, categoryId })
    } catch (e) {
      console.log(e)
    }
  },

  // 單獨餐廳詳細資料
  getRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { include: Category })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = restController
