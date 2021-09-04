const helpers = require('../_helpers')

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

// use Multer to upload image
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // index page
  app.get('/', authenticated, (req, res) => { res.redirect('/restaurants') })
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // Feeds
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  // restaurant
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  // restaurant count
  app.get('/restaurants/:id/dashboard', authenticated, restController.getCounts)

  // user post comment
  app.post('/comments', authenticated, commentController.postComment)

  // top 10 users
  app.get('/users/top', authenticated, restController.getTopUsers)

  // profile read & edit
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  // favorite & unfavorite
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

  // like & unlike
  app.post('/like/:restaurantId', authenticated, userController.likeRestaurant)
  app.delete('/like/:restaurantId', authenticated, userController.removeRestaurant)

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
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  // read
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.readRestaurant)

  // update
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  // delete
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  // admin users page
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  // admin category read
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

  // admin category create
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  // admin category update
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.editCategory)

  // admin category delete
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //admin comment delete
  app.delete('/comments/:id', authenticatedAdmin, adminController.deleteComment)
}
