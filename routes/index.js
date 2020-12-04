const helpers = require('../_helpers')

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) return next()
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) return next()
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  const authenticatedUser = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).id === Number(req.params.id)) return next()
      return res.redirect('back')
    }
    res.redirect('/signin')
  }

  // user interface - index
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/top', authenticated, restController.getTop10Rest)
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  // user interface - restaurants
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
  // user interface - comments
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
  // user interface - top user
  app.get('/users/top', authenticated, userController.getTopUser)
  // user interface - profile
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticatedUser, userController.editUser)
  app.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser)
  // user interface - favorites
  app.post('/favorite/:RestaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:RestaurantId', authenticated, userController.removeFavorite)
  // user interface - likes
  app.post('/like/:restaurantId', authenticated, userController.like)
  app.delete('/like/:restaurantId', authenticated, userController.unlike)
  // user interface - followship
  app.post('/following/:userId', authenticated, userController.follow)
  app.delete('/following/:userId', authenticated, userController.unfollow)

  // admin interface - manage restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  // admin interface - manage users
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUsers)
  // admin interface - manage categories
  app.get('/admin/categories/', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  // signup & signin & logout
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', userController.signIn)
  app.get('/logout', userController.logout)
}
