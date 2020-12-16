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
  postCategory: async (req, res) => {
    try {
      if (!req.body.categoryName) {
        req.flash('error_messages', "name didn't exist");
        return res.redirect('back');
      }
      await Category.create({
        name: req.body.categoryName,
      });
      res.redirect('/admin/categories');
    } catch (err) {
      console.log(err);
    }
  },
  putCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      await category.update({ name: req.body.categoryName });
      res.redirect('/admin/categories');
    } catch (err) {
      console.log(err);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      await category.destroy();
      return res.redirect('/admin/categories');
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = categoryController;
