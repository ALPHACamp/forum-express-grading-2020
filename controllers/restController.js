const db = require('../models/index')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category })
      .then(restaurants => {
        console.log('restaurants[0]', restaurants[0])
        const data = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.description.substring(0, 50),
          categoryName: restaurant.Category.name
        }))
        console.log('data: ', data[0])
        return res.render('restaurants', { restaurants: data })
      })
  }
}

module.exports = restController
