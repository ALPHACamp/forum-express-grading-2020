const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({ raw: true, nest: true })
            .then(categories => {
              if (req.params.id) {
                Category.findByPk(req.params.id)
                  .then(category => {
                    category = category.toJSON()
                    return res.render('admin/categories', { categories, category })
                  })
                  .catch(err => console.log(err))
              } else {
                res.render('admin/categories', { categories })
              }
            })
            .catch(err => console.log(err))
  },

  postCategory: (req, res) => {
    const name = req.body.name
    if (!name) {
      req.flash('error_messages', 'Category name can not be blank')
      return res.redirect('back')
    } else {
      return Category.create({ name })
        .then(category => res.redirect('/admin/categories'))
        .catch(err => console.log(err))
    }
  },

  putCategory: (req, res) => {
    const name = req.body.name
    if (!name) {
      req.flash('error_messages', 'Category name can not be blank')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({ name })
            .then(category => res.redirect('/admin/categories'))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
  },

  deleteCategory: (req, res) => {
  console.log("🚀 ~ file: categoryController.js ~ line 51 ~ req", req)
    return Category.findByPk(req.params.id)
            .then(category => {
              category.destroy()
              .then(category => res.redirect('/admin/categories'))
              .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
  }
}

module.exports = categoryController