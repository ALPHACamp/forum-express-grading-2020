const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    const { id } = req.params
    Category.findAll({ raw: true, nest: true }).then(categories => {
      if (id) {
        const category = categories.find(item => item.id.toString() === id)
        return res.render('admin/categories', { categories, category })
      }
      return res.render('admin/categories', { categories })
    })
  },

  postCategory: (req, res) => {
    const category = req.body
    if (!category.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    Category.create(category).then(category => {
      req.flash('success_messages', `category '${category.name}' was created successfully!`)
      res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    const { id } = req.params
    const update = req.body
    Category.findByPk(id).then(category => {
      category.update(update).then(category => {
        req.flash('success_messages', `category '${category.name}' was updated successfully!`)
        res.redirect('/admin/categories')
      })
    })
  },

  deleteCategory: (req, res) => {
    const { id } = req.params
    Category.findByPk(id).then(category => {
      category.destroy().then(category => {
        req.flash('success_messages', `category '${category.name}' was deleted successfully!`)
        res.redirect('/admin/categories')
      })
    })
  }
}

module.exports = categoryController
