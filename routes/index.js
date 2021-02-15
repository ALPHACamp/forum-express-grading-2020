const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

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



    // 連到 /admin 頁面就轉到 /admin/restaurants
    app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

    // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
    app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
    app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
    app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
    app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
    app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
    app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
    app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

    app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
    app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUser)

    app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
    app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
    app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
    app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
    app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

    app.get('/restaurants/:id', authenticated, restController.getRestaurant)
    app.get('/restaurants', authenticated, restController.getRestaurants)

    app.post('/comments', authenticated, commentController.postComment)
    app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

    app.get('/users/:id/edit', authenticated, userController.editUser)
    app.get('/users/:id', authenticated, userController.getUser)
    app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

    app.get('/signup', userController.signUpPage)
    app.post('/signup', userController.signUp)
    app.get('/signin', userController.signInPage)
    app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
    app.get('/logout', userController.logout)

    app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
}


