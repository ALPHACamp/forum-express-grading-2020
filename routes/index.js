const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = (app, passport) => {
  // If the user visits the homepage, it will be directed to the /restaurants page
  app.get('/', (req, res) => {
    res.redirect('./restaurants')
  })

  // '/restaurants' are handed over to restController.get Restaurants
  app.get('/restaurants', restController.getRestaurants)

  // Connect to the '/admin' page ,it will be directed to the /admin/restaurants
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))

  // '/admin/restaurants' are handed over to adminController.getRestaurants
  app.get('/admin/restaurants', adminController.getRestaurants)

  app.get('/signup', userController.signUpPage)

  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)

  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  )

  app.get('/logout', userController.logout)
}
