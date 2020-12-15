const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const db = require('../models');
const User = db.User;

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup');
  },

  signUp: async (req, res) => {
    try {
      if (req.body.passwordCheck !== req.body.password) {
        req.flash('error_messages', '兩次密碼輸入不同！');
        return res.redirect('/signup');
      }
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) {
        req.flash('error_messages', '信箱重複！');
        return res.redirect('/signup');
      }
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        ),
      });
      req.flash('success_messages', '成功註冊帳號！');
      return res.redirect('/signin');
    } catch (err) {
      console.log(err);
    }
  },

  signInPage: (req, res) => {
    return res.render('signin');
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    res.redirect('/restaurants');
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },

  passportAuth: passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true,
  }),
};

module.exports = userController;
