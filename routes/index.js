const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  // 渲染新增餐廳頁面的路由
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  // 新增餐廳
  app.post('/admin/restaurants', authenticatedAdmin, adminController.postRestaurant)
  // 顯示單一餐廳
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  // 新增登入以及登出的路由：
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true /* 可以得到為什麼失敗的訊息 */ }), userController.signIn)
  app.get('/logout', userController.logout)
}

// module.exports = function (app) {
//   app.get('/', (req, res) => res.redirect('/restaurants'))
//   //在 /restaurants 底下則交給 restController.getRestaurants 來處理
//   app.get('/restaurants', restController.getRestaurants)
// }

