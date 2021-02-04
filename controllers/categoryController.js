const db = require('../models');

const { Category } = db;

const categoryController = {
  // Create
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist');
      return res.redirect('back');
    }
    return Category.create({
      name: req.body.name,
    })
    .then((category) => {
      res.redirect('/admin/categories');
    });
  },
  // Read
  getCategories: (req, res) => {
    Category.findAll({
      raw : true,
      nest: true,
    })
    .then((categories) => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
        .then((category) => res.render('admin/categories', {
          categories,
          category: category.toJSON(),
        }));
      } else {
        return res.render('admin/categories', { categories });
      }
    });
  },
  // Update
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist');
      return res.redirect('back');
    }
    return Category.findByPk(req.params.id)
    .then((category) => {
      category.update(req.body)
      .then((category) => {
        res.redirect('/admin/categories');
      });
    });
  },
  // Delete
  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id)
    .then((category) => {
      category.destroy()
      .then((category) => res.redirect('/admin/categories'));
    });
  },
};

module.exports = categoryController;
