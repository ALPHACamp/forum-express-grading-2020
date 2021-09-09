const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true,
    }).then(categories => {
      console.log('========================', categories)
      callback({ categories })
      // if (req.params.id) {
      //   console.log('========================', req.params.id)
      //   Category.findByPk(req.params.id)
      //     .then(category => {
      //       callback({
      //         category: category.toJSON(),
      //         categories
      //       })
            // return res.render('admin/categories', {
            //   category: category.toJSON(),
            //   categories
            // })
      //     })
      // }
      // } else {
      //   callback({ categories })
      //   // return res.render('admin/categories', { categories })
      // }

    })
  }
}

module.exports = categoryService