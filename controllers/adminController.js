const adminService = require('../services/adminService')
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User

const adminController = {

  // 全部餐廳頁面
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  // 建立餐廳頁面
  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/create', { categories })
    } catch (e) {
      console.log(e)
    }
  },

  // 建立餐廳資料
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/restaurants')
    })
  },

  // 單獨餐廳詳細頁面
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  // 編輯餐廳頁面
  editRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true
      })
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/create', { restaurant, categories })
    } catch (e) {
      console.log(e)
    }
  },

  // 編輯餐廳資料
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/restaurants')
    })
  },

  // 刪除餐廳
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/restaurants')
      }
    })
  },

  // 權限頁面
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/users', { users })
    } catch (e) {
      console.log(e)
    }
  },

  // 改變權限
  toggleAdmin: async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findByPk(id)
      await user.update({
        ...user,
        isAdmin: user.isAdmin ? 0 : 1
      })
      req.flash('success_messages', '權限更新完成')
      return res.redirect('/admin/users')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
