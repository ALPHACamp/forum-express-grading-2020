const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')
const passport = require('../config/passport')

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

// use Multer to upload image
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


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

// index page
router.get('/', authenticated, (req, res) => { res.redirect('/restaurants') })
router.get('/restaurants', authenticated, restController.getRestaurants)

// Feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// Top restaurant
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
// restaurant
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// restaurant count
router.get('/restaurants/:id/dashboard', authenticated, restController.getCounts)


// user post comment
router.post('/comments', authenticated, commentController.postComment)

// top 10 users
router.get('/users/top', authenticated, restController.getTopUsers)

// profile read & edit
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

// favorite & unfavorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// like & unlike
router.post('/like/:restaurantId', authenticated, userController.likeRestaurant)
router.delete('/like/:restaurantId', authenticated, userController.removeRestaurant)

// follower & following
router.post('/following/:id', authenticated, userController.addFollowing)
router.delete('/following/:id', authenticated, userController.removeFollowing)

// admin index page
router.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/restaurants') })
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

// signup page
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// signin page
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// logout
router.get('/logout', userController.logOut)

// create
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

// read
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.readRestaurant)

// update
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

// delete
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// admin users page
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

// admin category read
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

// admin category create
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

// admin category update
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.editCategory)

// admin category delete
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

//admin comment delete
router.delete('/comments/:id', authenticatedAdmin, adminController.deleteComment)
