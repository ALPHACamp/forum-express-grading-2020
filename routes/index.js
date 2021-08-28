const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers') 
const { authenticate } = require('passport')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    return res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {return next()}
      return res.redirect('/restaurants')
    }
    return res.redirect('/signin')
  }

  app.get('/', (req, res) => res.redirect('/restaurants'))
  
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  
  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  app.get('/signup', userController.signUpPage)

  app.get('/signin', userController.signInPage)

  app.get('/logout', userController.logout)

  app.get('/users/:id', authenticated, userController.getUser)

  app.get('/users/:id/edit', authenticated, userController.editUser)

  app.post('/signup', userController.signUp)

  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin', 
    failureFlash: true
  }), userController.signIn)

  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  app.post('/comments', authenticated, commentController.postComment)

  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
}
