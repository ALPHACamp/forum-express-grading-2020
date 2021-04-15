const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

// 管理員
router.get('/admin/restaurants', adminController.getRestaurants)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

// 管理餐廳種類
router.get('/admin/categories', categoryController.getCategories)

module.exports = router
