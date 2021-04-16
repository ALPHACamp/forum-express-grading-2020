/* eslint-disable camelcase */
/* eslint-disable node/handle-callback-err */
/* eslint-disable node/no-callback-literal */
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {

  // 全部餐廳頁面
  getRestaurants: async (req, res, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      return callback({ restaurants })
    } catch (e) {
      console.log(e)
    }
  },

  // 建立餐廳資料
  postRestaurant: async (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    if (!name) return callback({ status: 'error', message: '名字不存在' })
    if (!file) {
      await Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null,
        CategoryId: categoryId
      })
      return callback({ status: 'success', message: '餐廳建立成功' })
    }
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
      return callback({ status: 'success', message: '餐廳建立成功' })
    })
  },

  // 單獨餐廳詳細頁面
  getRestaurant: async (req, res, callback) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      return callback({ restaurant })
    } catch (e) {
      console.log(e)
    }
  },

  // 編輯餐廳資料
  putRestaurant: async (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    const id = req.params.id
    if (!file) {
      const restaurant = await Restaurant.findByPk(id)
      restaurant.update({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: restaurant.image,
        CategoryId: categoryId
      })
      return callback({ status: 'success', message: '餐廳更新成功' })
    }
    imgur.setClientID(IMGUR_CLIENT_ID)
    imgur.upload(file.path, async (err, img) => {
      const restaurant = await Restaurant.findByPk(id)
      restaurant.update({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: file ? img.data.link : restaurant.image,
        CategoryId: categoryId
      })
      return callback({ status: 'success', message: '餐廳更新成功' })
    })
  },

  // 刪除餐廳
  deleteRestaurant: async (req, res, callback) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id)
      restaurant.destroy()
      return callback({ status: 'success', message: '餐廳刪除成功' })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminService
