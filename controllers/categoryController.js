const db = require('../models/index')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        if (req.params.id) {
          return Category.findByPk(req.params.id)
            .then(category => res.render('admin/categories', { categories, category: category.toJSON() }))
        } // 上面因有非同步，不是得用else去包裝就是上面要寫return
        return res.render('admin/categories', { categories })
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
