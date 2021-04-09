const db = require('../models')
const Category = db.Category

const categoryController = {

  // 全部餐廳種類
  getCategories: async (req, res) => {
    const id = req.params.id
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (id) {
        const category = await Category.findByPk(id)
        return res.render('admin/categories', { categories, category: category.toJSON() })
      }
      return res.render('admin/categories', { categories })
    } catch (e) {
      console.log(e)
    }
  },

  // 新增餐廳種類
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '請輸入種類名稱')
      return res.redirect('back')
    }
    Category.create({ name })
    return res.redirect('/admin/categories')
  },

  // 修改餐廳種類
  putCategory: async (req, res) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) {
      req.flash('error_messages', '請輸入種類名稱')
      return res.redirect('back')
    }
    try {
      const category = await Category.findByPk(id)
      category.update({ name })
      return res.redirect('/admin/categories')
    } catch (e) {
      console.log(e)
    }
  },

  // 刪除餐廳種類
  deleteCategory: async (req, res) => {
    const id = req.params.id
    try {
      const category = await Category.findByPk(id)
      category.destroy()
      return res.redirect('/admin/categories')
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = categoryController
