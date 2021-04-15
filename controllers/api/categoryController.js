const categoryService = require('../../services/categoryService')

const categoryController = {

  // 全部餐廳種類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = categoryController
