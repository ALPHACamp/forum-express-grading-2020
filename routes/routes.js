const express = require('express')
const multer = require('multer')
const passport = require('passport')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

const { authenticated, authenticatedAdmin, checkAccount } = require('../middlewares/auth')

// 直接導向一般使用者或管理員
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

// 一般使用者
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

// 管理員
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// 管理使用者
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

// 評論
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// 管理餐廳種類
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', checkAccount, passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// 登出
router.get('/logout', userController.logout)

module.exports = router
