const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      res.render('admin/categories', { categories })
    })
  },

  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_msg', "Please enter category's name.")
      return res.redirect('/admin/categories')
    }
    return Category.create({ name })
      .then(category => {
        req.flash('success_msg', 'Category was successfully created!')
        return res.redirect('/admin/categories')
      })
  },

  getCategory: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      Category.findByPk(req.params.id)
        .then(category => {
          res.render('admin/categories', { categories, category: category.toJSON() })
        })
    })
  },

  putCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_msg', 'Please enter category\'s name')
      return res.redirect('/admin/categories')
    }
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({
            name
          })
        })
        .then(restaurant => {
          req.flash('success_msg', 'Category was successfully to update.')
          return res.redirect('/admin/categories')
        })
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