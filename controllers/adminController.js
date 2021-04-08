const { Restaurant, User, Category } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: async (req, res) => {
    let restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })

    return res.render('admin/restaurants', { restaurants })
  },

  createRestaurant: async (req, res) => {
    const config = {
      pageTitle: '新增餐廳',
      method: '/admin/restaurants'
    }
    let categories = await Category.findAll({ raw: true, nest: true })

    return res.render('admin/create', { config, categories })
  },
  postRestaurat: async (req, res) => {
    const { name, categoryId, tel, address, opening_hours, description } = req.body
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : null,
            CategoryId: categoryId
          })
          req.flash('success_msg', `成功新增餐廳: "${name}"`)
          return res.redirect('/admin/restaurants')
        })
      } else {
        await Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: null,
          CategoryId: categoryId
        })

        req.flash('success_msg', `成功新增餐廳: "${name}"`)
        return res.redirect('/admin/restaurants')
      }
    } catch (e) {
      console.warn(e)
    }
  },

  getRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    try {
      let restaurant = await Restaurant.findByPk(
        restaurant_id,
        { include: [Category] }
      )

      return res.render('admin/detail', { restaurant: restaurant.toJSON() })
    } catch (e) {
      console.warn(e)
    }
  },

  editRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    const config = {
      pageTitle: '修改餐廳',
      method: `/admin/restaurants/${restaurant_id}?_method=PUT`
    }
    try {
      let restaurant = await Restaurant.findByPk(restaurant_id, { raw: true })
      let categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { config, restaurant, categories })
    } catch (e) {
      console.warn(e)
    }
  },

  putRestaurant: async (req, res) => {
    const restaurant_id = req.params.id
    const { name, categoryId, tel, address, opening_hours, description } = req.body
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          let restaurant = await Restaurant.findByPk(restaurant_id)
          await restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: categoryId
          })
          req.flash('success_msg', `成功修改餐廳: "${name}"`)
          return res.redirect('/admin/restaurants')
        })
      } else {
        let restaurant = await Restaurant.findByPk(restaurant_id)
        await restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: restaurant.image,
          CategoryId: categoryId
        })
        req.flash('success_msg', `成功修改餐廳: "${name}"`)
        return res.redirect('/admin/restaurants')
      }
    } catch (e) {
      console.warn(e)
    }
  },
  deleteRestaurant: async (req, res) => {
    const restaurant_id = req.params.id

    try {
      let restaurant = await Restaurant.findByPk(restaurant_id)
      await restaurant.destroy()

      return res.redirect('/admin/restaurants')
    } catch (e) {
      console.warn(e)
    }
  },

  //user
  getUsers: async (req, res) => {
    try {
      let users = await User.findAll({ raw: true })

      return res.render('admin/users', { users })
    } catch (e) {
      console.warn(e)
    }
  },
  toggleAdmin: async (req, res) => {
    const user_id = req.params.id
    try {
      let user = await User.findByPk(user_id)
      await user.update({ isAdmin: !user.isAdmin })

      return res.redirect('/admin/users')
    } catch (e) {
      console.warn(e)
    }
  }
}

module.exports = adminController