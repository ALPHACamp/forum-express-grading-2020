const db = require('../models/index')
const Category = db.Category

const categoryService = require('../services/categoryService.js')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then(() => res.redirect('/admin/categories'))
    }
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id)
      .then(category => {
        category.update(req.body)
          .then(() => res.redirect('/admin/categories'))
      })
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(() => res.redirect('/admin/categories'))
      })
  }
}

module.exports = categoryController
