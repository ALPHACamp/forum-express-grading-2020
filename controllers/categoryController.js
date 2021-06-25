const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true, nest: true })
      .then((categories) => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then((category) => {
              if (!category) {
                req.flash('err_msg', '查無此餐廳分類')
                return res.redirect('/admin/categories')
              }
              return res.render('admin/categories', { categories, category: category.toJSON() })
            })
        } else {
          return res.render('admin/categories', { categories })
        }
      })
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫欄位')
      return res.redirect('back')
    }
    Category.findAll({ where: { name: req.body.name } })
      .then((category) => {
        if (category.length) {
          req.flash('err_msg', '此類別已存在')
          return res.redirect('back')
        }
        return Category.create(req.body)
          .then(() => { return res.redirect('/admin/categories') })
      })
      .catch(err => next(err))
  },

  putCategory: (req, res, next) => {
    if (!req.body.name) {
      req.flash('err_msg', '請填寫欄位')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id)
      .then((category) => {
        if (!category) {
          req.flash('err_msg', '查無此餐廳分類')
          return res.redirect('/admin/categories')
        }
        return category.update(req.body)
          .then(() => { return res.redirect('/admin/categories') })
      })
      .catch(err => next(err))
  },

  deleteCategory: (req, res, next) => { //注意要確定沒有餐廳使用該分類才能刪除，否則會出錯(ForeignKeyConstraintError)
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) {
          req.flash('err_msg', '查無此餐廳分類')
          return res.redirect('/admin/categories')
        }
        return category.destroy()
          .then(() => { return res.redirect('/admin/categories') })
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController