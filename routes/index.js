const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  // If the user visits the homepage, it will be directed to the /restaurants page
  app.get('/', authenticated, (req, res) => {
    res.redirect('./restaurants')
  })

  // '/restaurants' are handed over to restController.get Restaurants
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // Connect to the '/admin' page ,it will be directed to the /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  )

  // '/admin/restaurants' are handed over to adminController.getRestaurants
  app.get(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.getRestaurants
  )

  app.get(
    '/admin/restaurants/create',
    authenticatedAdmin,
    adminController.createRestaurant
  )

  app.post(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.postRestaurant
  )

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
