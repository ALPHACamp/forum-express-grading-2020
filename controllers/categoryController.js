const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/categories', { categories })
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = categoryController
