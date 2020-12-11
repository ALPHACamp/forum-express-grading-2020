const db = require('../models');
const Category = db.Category;

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true,
      });
      if (req.params.id) {
        const category = await Category.findByPk(req.params.id);
        return res.render('admin/categories', {
          categories,
          category: category.toJSON(),
        });
      }
      res.render('admin/categories', { categories });
    } catch (err) {
      console.log(err);
    }
  },
  postCategory: (req, res) => {
    Category.create({
      name: req.body.categoryName,
    });
    res.redirect('/admin/categories');
  },
  getCategory: (req, res) => {},
  putCategory: async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    await category.update({ name: req.body.categoryName });
    res.redirect('/admin/categories');
  },
  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id)
      .then((category) => category.destroy())
      .then(() => res.redirect('/admin/categories'));
  },
};

module.exports = categoryController;
