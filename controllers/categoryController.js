const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/categories', { categories })
    } catch (e) {
      console.log(e)
    }
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '請輸入種類名稱')
      return res.redirect('back')
    }
    Category.create({ name })
    return res.redirect('/admin/categories')
  }
}
module.exports = categoryController
