const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category


const adminController = {
  getRestaurants: (req, res) => {
    // 自動導到views文件夾，找到admin文件的restaurants.handlebars
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      return res.json({ restaurants: restaurants })
    })
  },
}

module.exports = adminController