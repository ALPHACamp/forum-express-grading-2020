const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  //rest
  app.get('/', authenticated, (req, res) => {
    return res.redirect('/restaurants')
  })
  app.get('/restaurants', authenticated, restController.getRestaurants)

  //admin
  app.get('/admin', authenticatedAdmin, (req, res) => {
    return res.redirect('/admin/restaurants')
  })
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurat)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

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
}