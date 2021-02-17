const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({ 
              categories: categories, 
              category: category.toJSON() 
            })
          })
      } else {
        callback({ categories: categories })
      }
    })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          return callback({ status: 'success', message: 'Category was created successfully.' })
        })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              return callback({ status: 'success', message: 'Category was updated successfully.' })
            })
        })
    }
  },

  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            return callback({  status: 'success', message: 'Category was deleted successfully.' })
          })
      })
  }

}

module.exports = categoryService