const helpers = require('../_helpers')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const restaurantController = require('../controllers/restaurantController')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

// -----------------------------------------------------------------------------------

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    // if(req.isAuthenticated)
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    // if(req.isAuthenticated)
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // -----------------------------------------------------------------------------------

  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

  //在 /restaurants 底下則交給 restaurantController.getRestaurants 來處理
  app.get('/restaurants', authenticated, restaurantController.getRestaurants)
  app.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)


  app.post('/comments', authenticated, commentController.postComment)

  // -----------------------------------------------------------------------------------

  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  // 加上這個 middleware(upload.single('image')) 以後，multer 只要碰到 request 裡面有圖片的檔案，就會自動把檔案複製到 temp 資料夾去
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUsers)


  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


  // -----------------------------------------------------------------------------------

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  // 讓 Passport 直接做身份驗證，因為當 userController.signIn 收到 request 時，就一定是登入後的使用者了，這是為什麼剛才在 userController.signIn 沒看到驗證的邏輯
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

  // -----------------------------------------------------------------------------------

  app.get('/logout', userController.logout)
}
