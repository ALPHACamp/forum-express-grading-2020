const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {

  // 顯示全部餐廳
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({ include: Category })
      const data = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.substring(0, 50),
        categoryName: restaurant.Category.name
      }))
      return res.render('restaurants', { restaurants: data })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = restController
