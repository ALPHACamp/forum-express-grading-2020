const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userControllers')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({dest: 'temp/'})

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if(helpers.ensureAuthenticated(req)){
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if(helpers.ensureAuthenticated(req)){
      if(helpers.getUser(req).isAdmin) {return next()}
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  const authenticatedUser = (req, res, next) => {
    if(helpers.ensureAuthenticated(req) || Number(req.params.id) === helpers.getUser(req).id){
      return next()
    }
    res.redirect(`/users/${req.params.id}`)
  }
  //restaurant
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)


  //comment
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  //admin
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurants)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  app.get('/admin/users', authenticatedAdmin, adminController.getUser)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, upload.single('image'), adminController.toggleAdmin)


  //category
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin',passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true}) ,userController.signIn)
  app.get('/logout', userController.logOut)

  //users

  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser)
}

