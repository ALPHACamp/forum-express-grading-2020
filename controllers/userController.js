const imgur = require('imgur-node-api');

const { IMGUR_CLIENT_ID } = process.env;
const fs = require('fs');

const bcrypt = require('bcryptjs');
const db = require('../models');

const { User, Comment, Restaurant } = db;

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp    : (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！');
      return res.redirect('/signup');
    }
    // confirm unique user
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        req.flash('error_messages', '信箱重複！');
        return res.redirect('/signup');
      }
      User.create({
        name    : req.body.name,
        email   : req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
      }).then((user) => {
        req.flash('success_messages', '成功註冊帳號！');
        return res.redirect('/signin');
      });
    });
  },

  signInPage: (req, res) => res.render('signin'),
  signIn    : (req, res) => {
    req.flash('success_messages', '成功登入！');
    res.redirect('/restaurants');
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },

  // Profile Management
  // Read
  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
      ],
    })
    .then((user) => {
      user = user.toJSON();

      // Filter out unique restaurants
      const commentedRestaurant = new Map();
      user.Comments.forEach((value, index) => {
        const restaurantInfo = {
          RestaurantId   : value.RestaurantId,
          RestaurantImage: value.Restaurant.image,
        };
        if (!commentedRestaurant.has(value.RestaurantId)) {
          commentedRestaurant.set(value.RestaurantId, restaurantInfo);
        }
      });

      // Added comments count and commented restaurants for frontend display
      user.commentsCount = commentedRestaurant.size;
      user.commentedRestaurant = commentedRestaurant.values();

      // Remove unnecessary obj to be carried forward to save resource / speed up
      delete user.Comments;

      return res.render('profile', { user });
    });
  },
  // Update
  editUser: (req, res) => {
    User.findByPk(req.params.id)
    .then((user) => res.render('profileForm', {
      user: user.toJSON(),
    }));
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Name is required.');
      return res.redirect('back');
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => User.findByPk(req.params.id)
      .then((user) => {
        user.update({
          name : req.body.name,
          image: file ? img.data.link : user.image,
        })
        .then((user) => {
          req.flash('success_messages', 'Profile updated!');
          return res.redirect(`/users/${user.id}`);
        });
      }));
    } else {
      return User.findByPk(req.params.id)
      .then((user) => {
        user.update({
          name : req.body.name,
          image: user.image,
        })
        .then((user) => {
          req.flash('success_messages', 'Profile updated!');
          return res.redirect(`/users/${user.id}`);
        });
      });
    }
  },
};

module.exports = userController;
