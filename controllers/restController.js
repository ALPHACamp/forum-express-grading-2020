const db = require('../models')
const Restaurant = db.Restaurant

let restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, nest: true }).then(restaurants =>{
      return res.render('restaurants', {restaurants} )
    })    
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('restaurant', {restaurant})
      })
  }
}

module.exports = restController