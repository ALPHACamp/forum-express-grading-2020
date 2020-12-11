<<<<<<< HEAD
const helpers = require('../_helpers');

const passport = require('passport');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
=======
const helpers = require("../_helpers");

const passport = require("passport");
const multer = require("multer");

const upload = multer({ dest: "temp/" });

const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const categoryController = require("../controllers/categoryController.js");
const commentController = require("../controllers/commentController.js");
>>>>>>> A19-test

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
<<<<<<< HEAD
    res.redirect('/signin');
=======
    res.redirect("/signin");
>>>>>>> A19-test
  };
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next();
      }
<<<<<<< HEAD
      return res.redirect('/');
    }
    res.redirect('/signin');
  };

  app.get('/', authenticated, (req, res) => {
    res.redirect('/restaurants');
  });
  app.get('/restaurants', authenticated, restController.getRestaurants);

  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  );
  app.get(
    '/admin/restaurants',
=======
      return res.redirect("/");
    }
    res.redirect("/signin");
  };

  app.get("/", authenticated, (req, res) => {
    res.redirect("/restaurants");
  });
  app.get("/restaurants", authenticated, restController.getRestaurants);

  app.get("/restaurants/:id", authenticated, restController.getRestaurant);

  app.get("/admin", authenticatedAdmin, (req, res) =>
    res.redirect("/admin/restaurants")
  );
  app.get(
    "/admin/restaurants",
>>>>>>> A19-test
    authenticatedAdmin,
    adminController.getRestaurants
  );
  app.get(
<<<<<<< HEAD
    '/admin/restaurants/create',
=======
    "/admin/restaurants/create",
>>>>>>> A19-test
    authenticatedAdmin,
    adminController.createRestaurant
  );
  app.post(
<<<<<<< HEAD
    '/admin/restaurants',
    authenticatedAdmin,
    upload.single('image'),
    adminController.postRestaurant
  );
  app.get(
    '/admin/restaurants/:id',
=======
    "/admin/restaurants",
    authenticatedAdmin,
    upload.single("image"),
    adminController.postRestaurant
  );
  app.get(
    "/admin/restaurants/:id",
>>>>>>> A19-test
    authenticatedAdmin,
    adminController.getRestaurant
  );
  app.get(
<<<<<<< HEAD
    '/admin/restaurants/:id/edit',
=======
    "/admin/restaurants/:id/edit",
>>>>>>> A19-test
    authenticatedAdmin,
    adminController.editRestaurant
  );
  app.put(
<<<<<<< HEAD
    '/admin/restaurants/:id',
    authenticatedAdmin,
    upload.single('image'),
    adminController.putRestaurant
  );
  app.delete(
    '/admin/restaurants/:id',
=======
    "/admin/restaurants/:id",
    authenticatedAdmin,
    upload.single("image"),
    adminController.putRestaurant
  );
  app.delete(
    "/admin/restaurants/:id",
>>>>>>> A19-test
    authenticatedAdmin,
    adminController.deleteRestaurant
  );

<<<<<<< HEAD
  app.get('/signup', userController.signUpPage);
  app.post('/signup', userController.signUp);

  app.get('/signin', userController.signInPage);
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
=======
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);

  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
>>>>>>> A19-test
      failureFlash: true,
    }),
    userController.signIn
  );
<<<<<<< HEAD
  app.get('/logout', userController.logout);

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers);
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUsers);
=======
  app.get("/logout", userController.logout);

  app.get("/admin/users", authenticatedAdmin, adminController.getUsers);
  app.put(
    "/admin/users/:id/toggleAdmin",
    authenticatedAdmin,
    adminController.putUsers
  );

  app.get(
    "/admin/categories",
    authenticatedAdmin,
    categoryController.getCategories
  );
  app.post(
    "/admin/categories",
    authenticatedAdmin,
    categoryController.postCategory
  );
  app.delete(
    "/admin/categories/:id",
    authenticatedAdmin,
    categoryController.deleteCategory
  );
  app.get(
    "/admin/categories/:id",
    authenticatedAdmin,
    categoryController.getCategories
  );
  app.put(
    "/admin/categories/:id",
    authenticatedAdmin,
    categoryController.putCategory
  );

  app.post("/comments", authenticated, commentController.postComment);
  app.delete(
    "/comments/:id",
    authenticatedAdmin,
    commentController.deleteComment
  );

  app.get("/users/:id", authenticated, userController.getUser);
  app.get("/users/:id/edit", authenticated, userController.editUser);
  app.put(
    "/users/:id",
    authenticated,
    upload.single("userImage"),
    userController.putUser
  );
>>>>>>> A19-test
};
