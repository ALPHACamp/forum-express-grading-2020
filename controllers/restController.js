const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {

  // 顯示全部餐廳
  getRestaurants: (req, res) => {
    const pageLimit = 10
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },

  // 單獨餐廳詳細資料
  getRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { include: Category })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = restController
