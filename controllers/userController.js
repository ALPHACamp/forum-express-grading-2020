const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Comment = db.Comment;
const Restaurant = db.Restaurant;
const Favorite = db.Favorite;
const Like = db.Like;
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = "49e3187e6d178f9";
const helpers = require("../_helpers");

const userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！");
      return res.redirect("/signup");
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash("error_messages", "信箱重複！");
          return res.redirect("/signup");
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
            req.flash("success_messages", "成功註冊帳號！");
            return res.redirect("/signin");
          });
        }
      });
    }
  },

  signInPage: (req, res) => {
    return res.render("signin");
  },

  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/restaurants");
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  },
  getUser: (req, res) => {
    if (Number(req.params.id) === helpers.getUser(req).id) {
      return User.findByPk(req.params.id, {
        include: { model: Comment, include: [Restaurant] },
      }).then((user) => {
        let totalComments = user.dataValues.Comments.length;
        return res.render("user", {
          user: user.toJSON(),
          totalComments: totalComments,
        });
      });
    } else {
      req.flash("error_messages", "沒有權限進入他人的個人資訊頁面！");
      return res.redirect(`/users/${helpers.getUser(req).id}`);
    }
  },
  editUser: (req, res) => {
    if (Number(req.params.id) === helpers.getUser(req).id) {
      return User.findByPk(req.params.id).then((user) => {
        return res.render("editUser", {
          user: user.toJSON(),
        });
      });
    } else {
      req.flash("error_messages", "沒有權限進入他人修改個人資訊頁面！");
      return res.redirect(`/users/${helpers.getUser(req).id}`);
    }
  },
  putUser: (req, res) => {
    if (Number(req.params.id) === helpers.getUser(req).id) {
      if (!req.body.name) {
        req.flash("error_messages", "name didn't exist");
        return res.redirect("back");
      }

      const { file } = req;
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          return User.findByPk(req.params.id).then((user) => {
            user
              .update({
                name: req.body.name,
                image: file ? img.data.link : restaurant.image,
              })
              .then((user) => {
                req.flash(
                  "success_messages",
                  "user was successfully to update"
                );
                res.redirect(`/users/${helpers.getUser(req).id}`);
              });
          });
        });
      } else
        return User.findByPk(req.params.id).then((user) => {
          user
            .update({
              name: req.body.name,
              image: user.image,
            })
            .then((user) => {
              req.flash("success_messages", "user was successfully to update");
              res.redirect(`/users/${helpers.getUser(req).id}`);
            });
        });
    } else {
      req.flash("error_messages", "沒有權限修改他人資訊！");
      return res.redirect(`/users/${helpers.getUser(req).id}`);
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect("back");
    });
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return res.redirect("back");
      });
    });
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect("back");
    });
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return res.redirect("back");
      });
    });
  },
};

module.exports = userController;
