const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if(req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // index page
  app.get('/', authenticated, (req, res) => { res.redirect('/restaurants') })
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // admin index page
  app.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/restaurants') })
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  // signup page
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  // signin page
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

  // logout
  app.get('/logout', userController.logOut)

  // create
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, adminController.postRestaurant)
}
