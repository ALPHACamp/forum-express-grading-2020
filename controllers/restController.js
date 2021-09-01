const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAll({ 
      include: Category, 
      where: whereQuery 
    })
      .then(restaurants => {
        const data = restaurants.map(rest => ({ 
          ...rest.dataValues,
          description: rest.dataValues.description.substring(0, 50),
          categoryName: rest.Category.name
        }))
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => {
          return res.render('restaurants', { 
            restaurants: data,
            categories,
            categoryId
          })
        })
      })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        return res.render('restaurant', { 
          restaurant: restaurant.toJSON() 
        })
      })
  }
}

module.exports = restController