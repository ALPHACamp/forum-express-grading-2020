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
  }
}

module.exports = categoryService