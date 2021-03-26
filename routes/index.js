const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {
  // 身分驗證
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    return res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) return next()
    return res.redirect('/')
  }
  // 前台
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // 後台
  app.get('/', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  // 註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // 登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  // 登出
  app.get('/logout', userController.logout)
}
