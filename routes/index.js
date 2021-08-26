const restController = require('../controllers/restController.js')

module.exports = (app) => {
  // If the user visits the homepage, it will be directed to the /restaurants page
  app.get('/', (req, res) => {
    res.redirect('./restaurants')
  })

  // '/restaurants' are handed over to restController.get Restaurants
  app.get('/restaurants', restController.getRestaurants)
}
