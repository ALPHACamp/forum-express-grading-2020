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
  }
}

module.exports = categoryService
