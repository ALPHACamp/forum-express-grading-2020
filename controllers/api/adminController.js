const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../../services/adminService.js')


const adminController = {
  getRestaurants: (req, res) => {
    // 自動導到views文件夾，找到admin文件的restaurants.handlebars
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = adminController