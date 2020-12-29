const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const imgur = require('imgur-node-api');
const db = require('../models');
const User = db.User;
const Comment = db.Comment;
const Restaurant = db.Restaurant;

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

  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      // const comments = await Comment.findAll({
      //   where: { UserId: user.id },
      //   include: [Restaurant],
      // });
      // const data = comments.map((el) => ({
      //   ...el.dataValues,
      //   restaurantName: el.Restaurant.name,
      //   restaurantImage: el.Restaurant.image,
      // }));
      res.render('profile', { user: user.toJSON()
        // , comments: data 
      });
    } catch (err) {
      console.log(err);
    }
  },
  editUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      res.render('editProfile', { user: user.toJSON() });
    } catch (err) {
      console.log(err);
    }
  },
  putUser: async (req, res) => {
    try {
      // a19 測試無email
      // if (!req.body.name || !req.body.email) {
      //   req.flash('error_messages', "name or email didn't exist");
      //   return res.redirect('back');
      // }

      const { file } = req;
      if (file) {
        const user = await User.findByPk(req.params.id);
        imgur.setClientID(process.env.IMGUR_CLIENT_ID);
        await imgur.upload(file.path, async (err, img) => {
          if (err) return console.log(err);
          await user.update({
            name: req.body.name,
            email: req.body.email,
            image: img.data.link,
          });
        });
        return res.redirect(`/users/${user.id}`);
      }
      const user = await User.findByPk(req.params.id);
      await user.update({
        name: req.body.name,
        email: req.body.email,
        image: user.image,
      });
      return res.redirect(`/users/${user.id}`);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = userController;
