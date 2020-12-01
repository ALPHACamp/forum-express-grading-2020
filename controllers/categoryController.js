const db = require('../models')
const { Category } = db


const categoryController = {

  getCategories: (req, res) => {
    Category.findAll({ nest: true, raw: true }).then(categories => { return res.render('admin/categories', { categories }) })
  },

  postCategories: (req, res) => {
    if (!req.body.name || (req.body.name.indexOf(" ") === 0)) {   //多一個首字不能為空格的判斷
      req.flash('error_messages', '請輸入類別名稱')
      return res.redirect('back')
    } return Category.create({ name: req.body.name }).then(() => {
      req.flash('success_messages', '成功新增一筆分類')
      res.redirect('/admin/categories')
    }).catch(err => console.log(err))
  }

}
module.exports = categoryController
