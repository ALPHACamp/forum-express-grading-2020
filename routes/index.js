const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { authenticateUser, authenticateAdmin } = require('../middleware/auth')

module.exports = (app, passport) => {
  app.get('/', authenticateUser, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticateUser, restController.getRestaurants)

  app.get('/admin', authenticateAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  )
  app.get(
    '/admin/restaurants',
    authenticateAdmin,
    adminController.getRestaurants
  )
  app.get(
    '/admin/restaurants/create',
    authenticateAdmin,
    adminController.createRestaurant
  )
  app.post(
    '/admin/restaurants',
    authenticateAdmin,
    upload.single('image'),
    adminController.postRestaurant
  )
  app.get(
    '/admin/restaurants/:id',
    authenticateAdmin,
    adminController.getRestaurant
  )
  app.get(
    '/admin/restaurants/:id/edit',
    authenticateAdmin,
    adminController.editRestaurant
  )
  app.put(
    '/admin/restaurants/:id',
    authenticateAdmin,
    upload.single('image'),
    adminController.putRestaurant
  )
  app.delete(
    '/admin/restaurants/:id',
    authenticateAdmin,
    adminController.deleteRestaurant
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
