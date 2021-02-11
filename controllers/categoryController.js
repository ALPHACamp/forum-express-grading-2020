const db = require('../models')
const Category = db.Category
let categoryController = {
  //瀏覽所有分類
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', { categories: categories })
    })
  },

  //新增一筆分類
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      }).then((category) => {
        res.redirect('/admin/categories')
      })
    }
  }
}
module.exports = categoryController