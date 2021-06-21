const fs = require("fs");
const db = require("../models");
const Restaurant = db.Restaurant;
const User = db.User;
// const helpers = require('../_helpers');
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then((restaurants) => {
      return res.render("admin/restaurants", { restaurants: restaurants });
    });
  },

  createRestaurant: (req, res) => {
    return res.render("admin/create");
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "name didn't exist");
      return res.redirect("back");
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
        }).then((restaurant) => {
          req.flash("success_messages", "restaurant was successfully created");
          return res.redirect("/admin/restaurants");
        });
      });
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
      }).then((restaurant) => {
        req.flash("success_messages", "restaurant was successfully created");
        return res.redirect("/admin/restaurants");
      });
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render("admin/restaurant", {
          restaurant: restaurant,
        });
      }
    );
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(
      (restaurant) => {
        return res.render("admin/create", { restaurant: restaurant });
      }
    );
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "name didn't exist");
      return res.redirect("back");
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
            })
            .then((restaurant) => {
              req.flash(
                "success_messages",
                "restaurant was successfully to update"
              );
              res.redirect("/admin/restaurants");
            });
        });
      });
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
          })
          .then((restaurant) => {
            req.flash(
              "success_messages",
              "restaurant was successfully to update"
            );
            res.redirect("/admin/restaurants");
          });
      });
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy().then((restaurant) => {
        res.redirect("/admin/restaurants");
      });
    });
  },

  getUsers: (req, res) => {
    User.findAll({ raw: true }).then((users) => {
      res.render("admin/restaurants", { users });
    });
  },

  toggleAdmin: (req, res) => {
    const id = req.params.id;

    User.findOne({
      where: {
        id,
      },
    })
      .then((user) =>
        user.update({
          isAdmin: user.isAdmin ? false : true,
        })
      )
      .then((user) => {
        req.flash(
          "success_messages",
          `Change ${user.name} to ${user.isAdmin ? "admin" : "user"}`
        );
        res.redirect("/admin/users");
      })
      .catch((e) => console.log(e));
  },
};

module.exports = adminController;
