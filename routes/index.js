const helpers = require('../_helpers')
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
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
 //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

 //在前台瀏覽全部餐廳清單
  app.get('/restaurants', authenticated, restController.getRestaurants)
  //在前台顯示最新評論
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  //在前台瀏覽一筆餐廳資料
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  //在前台瀏覽一筆餐廳資料的dashboard
  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

  //在前台留下一筆餐廳資料評論資料
  app.post('/comments', authenticated, commentController.postComment)
  //權限者可在前台刪除一筆餐廳評論資料
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
  //在前台瀏覽個人基本資料
  app.get('/users/:id', authenticated, userController.getUser)
  //在前台編輯個人基本資料
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'),userController.putUser)

  //在前台把一筆餐廳加入我的最愛、移除我的最愛
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
  //在前台Like、移除like一筆餐廳
  app.post('/like/:restaurantId', authenticated, userController.addLike)
  app.delete('/like/:restaurantId', authenticated, userController.removeLike)
  // 連到 /admin 頁面就轉到 /admin/restaurants
 app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

 // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
 app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  //在後台瀏覽使用者
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  //在後台更改使用者權限
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  //後台新增一筆餐廳資料
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  //後台瀏覽一筆餐廳資料
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  //後臺編輯一筆餐廳資料
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  //後臺刪除一筆餐廳資料
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  //後臺瀏覽所有類別資料
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  //後台新增一筆類別資料
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  //後臺編輯一筆類別資料
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  //後臺刪除一筆類別資料
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)
 //註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  //登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
  
}
