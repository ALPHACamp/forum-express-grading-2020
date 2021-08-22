const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // 指定上傳資料夾: temp

module.exports = (app, passport) => {
  const authenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticateAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/', authenticate, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticate, restController.getRestaurants)

  app.get('/admin', authenticateAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticateAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticateAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticateAdmin, upload.single('image'), adminController.postRestaurnat) //middleware multer 只要碰到 request 裡面有圖片檔案，會自動把檔案複製到 temp 資料夾。
  app.get('/admin/restaurants/:id', authenticateAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticateAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticateAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticateAdmin, adminController.deleteRestaurant)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
}