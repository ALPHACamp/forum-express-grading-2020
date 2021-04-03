const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

const { authenticated, authenticatedAdmin } = require('../middlewares/auth')

router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

router.get('/restaurants', authenticated, restController.getRestaurants)

router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', userController.signIn)
router.get('/logout', userController.logout)

module.exports = router
