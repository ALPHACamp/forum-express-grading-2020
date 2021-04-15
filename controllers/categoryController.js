const categoryService = require('../services/categoryService')

const categoryController = {

  // 全部餐廳種類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  // 新增餐廳種類
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/categories')
    })
  },

  // 修改餐廳種類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/categories')
    })
  },

  // 刪除餐廳種類
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/categories')
      }
    })
  }
}

module.exports = categoryController
