const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const pageLimit = 10

let restController = {
  getRestaurants: (req, res) => {
    let categoryId = ''
    let whereQuery = {}
    let offset = (req.query.page - 1) * pageLimit || 0
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    return Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: [Category],
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50)
        }
      })
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurant => {
      return res.render('restaurant', { restaurant })
    })
  }
}

module.exports = restController