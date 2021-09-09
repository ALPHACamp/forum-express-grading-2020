const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService.js')

const categoryController = {
  getCategories: (req, res) => {
    categoryService
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('warning_msg', '分類名稱不存在')
      return res.redirect('back')
    }
    Category.findOne({ where: { name: req.body.name } }).then(category => {
      if (category) {
        req.flash('warning_msg', '此分類已存在!')
        return res.redirect('back')
      }
      Category.create({
        name: req.body.name,
      })
        .then(() => {
          return res.redirect('categories')
        })
    })
  },

  editCategory: (req, res) => {
    return Category.findByPk(req.params.id).then(category => {
      category.update({
        name: req.body.name
      })
        .then(() => {
          return res.redirect('/admin/categories')
        })
    })
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        console.log(category)
        category.destroy()
      })
      .then(() => {
        res.redirect('/admin/categories')
      })
  }
}

module.exports = categoryController