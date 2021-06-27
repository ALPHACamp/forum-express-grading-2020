const db = require('../models')
const Category = db.Category

let categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        return res.render('admin/categories', { categories: categories, category: category.toJSON() })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
    } catch (err) {
      return console.warn(err)
    }
  },

  postCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      } else {
        await Category.create({ name: req.body.name })
        return res.redirect('/admin/categories')
      }
    } catch (err) {
      return console.warn(err)
    }
  },

  putCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      } else {
        const category = await Category.findByPk(req.params.id)
        await category.update(req.body)
        return res.redirect('/admin/categories')
      }
    } catch (err) {
      return console.warn(err)
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return res.redirect('/admin/categories')
    } catch (err) {
      return console.warn(err)
    }
  }
}
module.exports = categoryController