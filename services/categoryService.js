const db = require('../models/index')
const Category = db.Category

const categoryService = {
  getCategories: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })

      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        return callback({ categories, category: category.toJSON() })
      }
      return callback({ categories })
    } catch (err) {
      console.warn(err)
    }
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    } else {
      Category.create({
        name: req.body.name
      })
        .then(() => callback({ status: 'success', message: "create success" }))
    }
  }
}

module.exports = categoryService
