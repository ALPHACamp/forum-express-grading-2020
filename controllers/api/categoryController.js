const categoryService = require('../../services/categoryService')

const categoryController = {

  // 全部餐廳種類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  // 新增餐廳種類
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },

  // 修改餐廳種類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = categoryController
