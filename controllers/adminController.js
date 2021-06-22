const Ajv = require('ajv').default
const addFormats = require('ajv-formats')
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
require('ajv-errors')(ajv)
const { schema } = require('../controllers/schema')
const validate = ajv.compile(schema)
const imgur = require('imgur-node-api')
const { Restaurant, User, Category } = require('../models')
imgur.setClientID(process.env.IMGUR_CLIENT_ID)

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true, nest: true, include: Category })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch(error => {
        next(error)
      })
  },

  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      res.render('admin/create', { categories })
    })
  },

  postRestaurant: (req, res, next) => {
    const { name, tel, address, opening_hours, description } = req.body
    const restaurant = req.body
    let error_msg = []

    if (!name || !tel || !address || !opening_hours) {
      error_msg = [{ message: '* 為必填欄位' }]
      return res.render('admin/create', { restaurant, error_msg })
    }

    validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
    error_msg = validate.errors
    if (error_msg) {
      return res.render('admin/create', { restaurant, error_msg })
    }

    const { file } = req
    if (file) {
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null,
          CategoryId: restaurant.categoryId
        })
          .then(() => {
            req.flash('success_msg', 'restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
          .catch(error => {
            next(error)
          })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null,
        CategoryId: restaurant.categoryId
      })
        .then(() => {
          req.flash('success_msg', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
        .catch(error => {
          next(error)
        })
    }
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found.')
        res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(error => {
        next(error)
      })
  },

  editRestaurant: (req, res, next) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            if (!restaurant) throw new Error('restaurant not found.')
            return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
          })
          .catch(error => {
            next(error)
          })
      })
      .catch(error => {
        next(error)
      })
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name || !tel || !address || !opening_hours) {
      req.flash('warning_msg', '* 為必填欄位')
      return res.redirect('back')
    }

    validate({ name, tel, address, opening_hours: `${opening_hours}:00Z`, description })
    if (validate.errors) {
      for (const error of validate.errors) {
        req.flash('error_msg', error)
      }
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then(restaurant => {
          if (!restaurant) throw new Error('restaurant not found.')

          restaurant
            .update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then(() => {
              req.flash('success_msg', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
            .catch(error => {
              next(error)
            })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found.')

        restaurant
          .update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: null,
            CategoryId: req.body.categoryId
          })
          .then(() => {
            req.flash('success_msg', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
          .catch(error => {
            next(error)
          })
      })
    }
  },

  deleteRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found.')
        restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(error => {
        next(error)
      })
  },

  getUsers: (req, res, next) => {
    User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(error => {
        next(error)
      })
  },

  toggleAdmin: (req, res, next) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('User not found.')
        user.update({ isAdmin: !user.isAdmin })
      })
      .then(() => {
        req.flash('success_msg', 'user was successfully to update')
        res.redirect('/admin/users')
      })
      .catch(error => {
        next(error)
      })
  }
}

module.exports = adminController
