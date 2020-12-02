const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const fs = require('fs')
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User

let adminController = {
    getRestaurants: (req, res) => {
        return Restaurant.findAll({
            raw: true,
            nest: true,
            include: [Category]
        })
            .then(restaurants => {
                console.log(restaurants[2])
                return res.render('admin/restaurants', { restaurants })
            })
    },
    createRestaurants: (req, res) => {
        return res.render('admin/create')
    },
    postRestaurant: (req, res) => {
        const { name, tel, address, opening_hours, description } = req.body
        const { file } = req
        if (!req.body.name) {
            req.flash('error_msg', "Name didn't exist")
            return res.redirect('back')
        }
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                return Restaurant.create({ name, tel, address, opening_hours, description, image: file ? img.data.link : null })
                    .then(restaurant => {
                        req.flash('success_msg', 'restaurant was successfully created')
                        res.redirect('/admin/restaurants')
                    })
            })
        } else {
            return Restaurant.create({ name, tel, address, opening_hours, description, image: null })
                .then(restaurant => {
                    req.flash('success_msg', 'restaurant was successfully created!')
                    res.redirect('/admin/restaurants')
                })
        }
    },
    getRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id, {
            raw: true,
            nest: true,
            include: [Category]
        })
            .then(restaurant => {
                return res.render('admin/restaurant', { restaurant })
            })
    },
    editRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id, { raw: true })
            .then(restaurant => {
                return res.render('admin/create', { restaurant })
            })
    },
    putRestaurant: (req, res) => {
        const { name, tel, address, opening_hours, description } = req.body
        const { file } = req
        if (!req.body.name) {
            req.flash('error_msg', "Name didn't exist")
            return res.redirect('back')
        }
        return Restaurant.findByPk(req.params.id)
            .then(restaurant => {
                if (file) {
                    img.setClientID(IMGUR_CLIENT_ID)
                    img.upload(file.path, (err, img) => {
                        restaurant.update({ name, tel, address, opening_hours, description, image: file ? img.data.link : restaurant.img })
                    })
                } else {
                    restaurant.update({ name, tel, opening_hours, address, description, image: restaurant.image })
                }
            })
            .then(restaurant => {
                req.flash('success_msg', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
            })
    },
    deleteRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id)
            .then(restaurant => restaurant.destroy())
            .then(() => {
                req.flash('success_msg', 'restaurant was successfully to delete')
                res.redirect('/admin/restaurants')
            })
    },
    getUser: (req, res) => {
        return User.findAll({ raw: true })
            .then(user => {
                res.render('admin/users', { user })
            })
    },
    toggleAdmin: (req, res) => {
        return User.findByPk(req.params.id)
            .then(user => {
                const changed2Admin = !user.isAdmin
                user.update({ isAdmin: changed2Admin })
            })
            .then(user => {
                req.flash('success_msg', 'User was successfully to updated')
                res.redirect('/admin/users')
            })
    }
}
module.exports = adminController