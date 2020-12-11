const fs = require('fs');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup');
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！');
      return res.redirect('/signup');
    } else {
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash('error_messages', '信箱重複！');
          return res.redirect('/signup');
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            ),
          }).then((user) => {
            req.flash('success_messages', '成功註冊帳號！');
            return res.redirect('/signin');
          });
        }
      });
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

  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      res.render('profile', { user: user.toJSON() });
    } catch (err) {
      console.log(err);
    }
  },
  editUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      res.render('editProfile', { user: user.toJSON() });
    } catch (err) {
      console.log(err);
    }
  },
  putUser: async (req, res) => {
    try {
      const { file } = req;
      const user = await User.findByPk(req.user.id);
      if (file) {
        fs.readFile(file.path, (err, data) => {
          if (err) return console.log(err);
          const fileName = `upload/${req.user.name}.${Date.now()}.jpg`;
          fs.writeFile(
            `${fileName}`,
            data,
            async () => {
              await user.update({
                name: req.body.userName,
                email: req.body.userEmail,
                image: file ? `/${fileName}` : null,
              });
            }
          );
        });
      } else {
        console.log('no image');
        await user.update({
          name: req.body.userName,
          email: req.body.userEmail,
          image: null,
        });
      }
      res.redirect(`/users/${req.user.id}`);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = userController;
