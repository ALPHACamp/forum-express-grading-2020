const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', {
              category: category.toJSON(),
              categories
            })
          })
      } else {
        callback({ categories })
      }
    })
  },
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'This category isn\'t exist!' })
    } else {
      return Category.create({
        name: req.body.name,
      })
        .then(category => {
          callback({ status: 'success', message: 'Category created successfully!' })
        })
    }
  },
  editCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'Name isn\'t exist!' })
    } else {
      return Category.findByPk(req.params.id).then(category => {
        category.update({
          name: req.body.name
        })
          .then(() => {
            callback({ status: 'success', message: 'Edited successfully!' })
            // return res.redirect('/admin/categories')
          })
      })
    }
  },
  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
      })
      .then(() => {
        callback({ status: 'success', message: 'Successfully deleted!' })
      })
  }
}

module.exports = categoryService