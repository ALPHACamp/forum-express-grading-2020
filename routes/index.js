const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  //rest
  app.get('/', authenticated, (req, res) => {
    return res.redirect('/restaurants')
  })
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  //admin
  app.get('/admin', authenticatedAdmin, (req, res) => {
    return res.redirect('/admin/restaurants')
  })
  //admin
  //admin-restaurant
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurat)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  //admin-users
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  //user
  app.get('/users/signUp', userController.signUpPage)
  app.post('/users/signUp', userController.signUp)

  //auth
  app.get('/users/signIn', userController.signInPage)
  app.post('/users/signIn',
    passport.authenticate('local', {
      successRedirect: '/restaurants',
      failureRedirect: '/users/signIn'
    })
  )
  app.get('/users/logout', userController.logout)

  //profile
  app.get('/users/:id', userController.getUser)
  app.get('/users/:id/edit', userController.editUser)
  app.put('/users/:id', upload.single('image'), userController.putUser)

  //category
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //comment
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
}