const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then(category => { return res.render('admin/categories', { categories, category: category.toJSON() }) })
        }
        return res.render('admin/categories', { categories })
      })
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '請新增分類名稱')
      return res.redirect('back')
    }
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
  },
  putCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '請輸入分類名稱')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id)
      .then(category =>
        category.update({ name })
          .then(() => res.redirect('/admin/categories')))
  },
  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(() => res.redirect('/admin/categories'))
      })
  }
}

module.exports = categoryController