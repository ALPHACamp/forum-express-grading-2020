const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id)
          .then(category => {
            res.render('admin/categories', { categories, category: category.toJSON() })
          })
      }
      return res.render('admin/categories', { categories })
    })
  },

  postCategory: (req, res) => {
    adminService.postCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('/admin/categories')
      }
      req.flash('success_msg', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    adminService.putCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('/admin/categories')
      }
      req.flash('success_msg', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
        return res.redirect('/admin/categories')
      })
  }
}

module.exports = categoryController