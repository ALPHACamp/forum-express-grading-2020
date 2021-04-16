const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const commentController = require('../controllers/api/commentController')
// const restController = require('../controllers/api/restController')
// const userController = require('../controllers/api/userController')

const { authenticated, authenticatedAdmin } = require('../middlewares/api/auth')

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

router.post('/comments', commentController.postComment)
router.delete('/comments/:id', commentController.deleteComment)

router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategory)
router.put('/admin/categories/:id', categoryController.putCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)

// router.post('/signup', userController.signUp)
// router.post('/signin', userController.signIn)

module.exports = router
