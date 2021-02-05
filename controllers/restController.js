const db = require('../models');

const { Restaurant } = db;
const { Category } = db;

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {};
    let categoryId = '';
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery.CategoryId = categoryId;
    }

    Restaurant
    .findAll({
      include: Category,
      where  : whereQuery,
    })
    .then((restaurants) => {
      const data = restaurants.map((r) => ({
        ...r.dataValues, // spread up restaurant details
        description : r.dataValues.description.substring(0, 50), // override desc with shorter ver
        categoryName: r.Category.name,
      }));

      Category.findAll({
        raw : true,
        nest: true,
      }).then((categories) => // 取出 categoies
        res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
        }));
    });
  },
  getRestaurant: (req, res) => {
    Restaurant
    .findByPk(req.params.id, {
      include: Category,
    })
    .then((restaurant) => res.render('restaurant', {
      restaurant: restaurant.toJSON(),
    }));
  },
};

module.exports = restController;
