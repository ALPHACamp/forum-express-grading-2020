const adminService = require('../../services/adminService')

const adminController = {

  // 全部餐廳頁面
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

  // 單獨餐廳詳細頁面
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = adminController
