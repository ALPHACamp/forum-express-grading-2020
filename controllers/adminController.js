const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User
const helpers = require('../_helpers')                     // add for test

const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      return res.render('admin/restaurants', { restaurants: restaurants })
    } catch (err) {
      return console.warn(err)
    }
  },

  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { categories: categories })
    } catch (err) {
      return console.warn(err)
    }
  },

  postRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            CategoryId: req.body.categoryId
          })
          req.flash('success_messages', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
      } else {
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        })
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      }
    } catch (err) {
      return console.warn(err)
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category] })
      return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      return console.warn(err)
    }
  },

  editRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      const restaurant = await Restaurant.findByPk(req.params.id)
      return res.render('admin/create', { restaurant: restaurant.toJSON(), categories: categories })
    } catch (err) {
      return console.warn(err)
    }
  },

  putRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: req.body.categoryId
          })
          req.flash('success_messages', 'restaurant was successfully to update')
          res.redirect('/admin/restaurants')
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        })
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      }
    } catch (err) {
      return console.warn(err)
    }
  },

  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      req.flash('success_messages', 'restaurant was successfully to delete')
      res.redirect('/admin/restaurants')
    } catch (err) {
      return console.warn(err)
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users: users })
    } catch (err) {
      return console.warn(err)
    }
  },

  toggleAdmin: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      await user.update({ isAdmin: !user.toJSON().isAdmin, updated_by: req.user.id })
      // await user.update({ isAdmin: !user.toJSON().isAdmin, updated_by: helpers.getUser(req).id })  // add for test
      req.flash('success_messages', 'user role was successfully to update')
      res.redirect('/admin/users')
    } catch (err) {
      return console.warn(err)
    }
  }
}

module.exports = adminController