const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;
const Comment = db.Comment;
const User = db.User;

const pageLimit = 10;

const limitDescription = (description, limit = 48) => {
  const newRescription = [];
  if (description.length > limit) {
    description.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newRescription.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newRescription.join(' ')}...`;
  }
  return description;
};

const restController = {
  getRestaurants: async (req, res) => {
    try {
      let offset = 0;
      let categoryId = '';
      const whereCategory = {};
      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit;
      }
      if (req.query.categoryId) {
        categoryId = Number(req.query.categoryId);
        whereCategory.CategoryId = categoryId;
      }
      const restaurants = await Restaurant.findAndCountAll({
        // raw: true,
        // nest: true,
        include: Category,
        where: whereCategory,
        offset,
        limit: pageLimit,
      });
      const categories = await Category.findAll({ raw: true, nest: true });

      const data = restaurants.rows.map((r) => ({
        ...r.dataValues,
        description: limitDescription(r.dataValues.description),
        categoryName: r.Category.name,
      }));

      const page = Number(req.query.page) || 1;
      const pages = Math.ceil(restaurants.count / pageLimit);
      const totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      const prev = page - 1 < 1 ? 1 : page - 1;
      const next = page + 1 > pages ? pages : page + 1;

      res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        page,
        totalPage,
        prev,
        next,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, { model: Comment, include: [User] }],
      });
      // console.log(restaurant.toJSON().Comments[0].User.name);
      res.render('restaurant', { restaurant: restaurant.toJSON() });
    } catch (err) {
      console.log(err);
    }
  },
};
module.exports = restController;
