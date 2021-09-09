const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService.js')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('warning_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  editCategory: (req, res) => {
    categoryService.editCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('warning_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_msg', data['message'])
        return res.redirect('/admin/categories')
      }
    })
  }
}

module.exports = categoryController