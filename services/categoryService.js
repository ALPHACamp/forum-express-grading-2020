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
  }
}

module.exports = categoryService
