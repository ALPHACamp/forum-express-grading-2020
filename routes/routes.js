const express = require('express');
const router = express.Router();

const passport = require('../config/passport')

const helpers = require('../_helpers')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const restaurantController = require('../controllers/restaurantController')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

// -----------------------------------------------------------------------------------

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

const checkUserId = (req, res, next) => {
  if (Number(req.params.id) === Number(helpers.getUser(req).id)) {
    return next()
  }
  res.redirect('/signin')
}

// -----------------------------------------------------------------------------------

//如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

//在 /restaurants 底下則交給 restaurantController.getRestaurants 來處理
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restaurantController.getFeeds)
router.get('/restaurants/top', authenticated, restaurantController.getTopRestaurant)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restaurantController.getDashboard)


router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)


router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, checkUserId, userController.editUser)
router.put('/users/:id', authenticated, checkUserId, upload.single('image'), userController.putUser)


router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)


router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)


router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// -----------------------------------------------------------------------------------

// 連到 /admin 頁面就轉到 /admin/restaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

// 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
// 加上這個 middleware(upload.single('image')) 以後，multer 只要碰到 request 裡面有圖片的檔案，就會自動把檔案複製到 temp 資料夾去
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUsers)


router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


// -----------------------------------------------------------------------------------

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
// 讓 Passport 直接做身份驗證，因為當 userController.signIn 收到 request 時，就一定是登入後的使用者了，這是為什麼剛才在 userController.signIn 沒看到驗證的邏輯
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logout)

// -----------------------------------------------------------------------------------

module.exports = router