/* eslint-disable no-undef */
/* eslint-disable node/no-callback-literal */
const db = require('../models')
const Category = db.Category

const categoryService = {

  // 全部餐廳種類
  getCategories: async (req, res, callback) => {
    const id = req.params.id
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      if (id) {
        const category = await Category.findByPk(id)
        return res.render('admin/categories', { categories, category: category.toJSON() })
      }
      callback({ categories })
    } catch (e) {
      console.log(e)
    }
  },

  // 新增餐廳種類
  postCategory: async (req, res, callback) => {
    const { name } = req.body
    if (!name) { return callback({ status: 'error', message: '請輸入種類名稱' }) }
    await Category.create({ name })
    return callback({ status: 'success', message: '種類建立成功' })
  },

  // 修改餐廳種類
  putCategory: async (req, res, callback) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) return callback({ status: 'error', message: '請輸入種類名稱' })
    try {
      const category = await Category.findByPk(id)
      category.update({ name })
      return callback({ status: 'success', message: '種類建立成功' })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = categoryService
