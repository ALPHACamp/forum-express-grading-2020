/* eslint-disable node/no-callback-literal */
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {

  // 全部餐廳頁面
  getRestaurants: async (req, res, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      callback({ restaurants })
    } catch (e) {
      console.log(e)
    }
  },

  // 單獨餐廳詳細頁面
  getRestaurant: async (req, res, callback) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      callback({ restaurant })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminService
