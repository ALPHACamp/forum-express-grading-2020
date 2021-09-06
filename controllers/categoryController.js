const db = require('../models')
const Category = db.Category

const categoryController = {

  // 瀏覽目錄
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', {
              categories: categories,
              category: category.toJSON()
            })
          })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
    })
  },

  // 新增分類名稱
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', '請輸入分類名稱')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then(() => {
          res.redirect('/admin/categories')
        })
    }
  },

  // 編輯分類名稱
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', '請輸入分類名稱')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then(() => {
              res.redirect('/admin/categories')
            })
        })
    }
  },

  // 刪除分類
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = categoryController
