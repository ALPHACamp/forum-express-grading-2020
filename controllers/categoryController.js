const db = require('../models')
const Category = db. Category
let categoryController = {
    getCategories: (req, res) => {
        Category.findAll({raw: true})   
        .then(categories => {
            if(req.params.id) {
                category = categories.find(obj => obj.id == req.params.id)
                res.render('admin/categories', {categories, category})
            }else{
                res.render('admin/categories', {categories})
            }
        })
    },
    postCategory: (req, res) => {
        Category.create({name: req.body.name})
            .then(category => {
                req.flash('success_msg', 'Category was successfully created !')
                res.redirect('/admin/categories')
            })
    },
    putCategory: (req, res) => {
        Category.findByPk(req.params.id)
            .then(category => {
                category.update({name: req.body.name})
            })
            .then(() => {
                req.flash('success_msg', 'Category was successfully updated !')
                res.redirect('/admin/categories')
            })
    },
    deleteCategory: (req, res) => {
        Category.findByPk(req.params.id)
            .then(category => category.destroy())
            .then(() => {
                req.flash('success_msg', 'Category was successfully deleted !')
                res.redirect('/admin/categories')
            })
    }
}

module.exports = categoryController