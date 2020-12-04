const bcrypt = require('bcryptjs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User

let userController = {
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: (req, res) => {
        const { email, name, password, passwordCheck } = req.body
        if (passwordCheck !== password) {
            req.flash('error_msg', '兩次密碼輸入不同')
            return res.render('signup', { email, name })
        } else {
            User.findOne({ where: { email: email } })
                .then(user => {
                    if (user) {
                        req.flash('error_msg', '信箱重複')
                        return res.render('signup', { email, name })
                    } else {
                        User.create({
                            name: name,
                            email: email,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                        }).then(user => {
                            return res.redirect('/signin')
                        })
                    }
                })
        }
    },
    signInPage: (req, res) => {
        return res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_msg', '成功登入！')
        res.redirect('/restaurants')
    },
    logOut: (req, res) => {
        req.flash('success_msg', '成功登出！')
        req.logout()
        res.redirect('/signin')
    },
    getUser: (req, res) => {
        // if(req.user.id !== Number(req.params.id)){
        //     return res.redirect('/restaurants')
        // }
        //辨別使用者但會使測試失敗
        User.findByPk(req.params.id)
            .then(user => {
                res.render('profile', { user: user.toJSON() })
            })
    },
    editUser: (req, res) => {
        // if(req.user.id !== Number(req.params.id)){
        //     return res.redirect('/restaurants')
        // }
        //辨別使用者但會使測試失敗
        User.findByPk(req.params.id)
            .then(user => {
                res.render('edit-profile', { user: user.toJSON() })
            })
    },
    putUser: (req, res) => {
        const { file } = req
        const update = req.body
        const id = req.params.id
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                if (err) console.log(err)
                return User.findByPk(id)
                    .then(user => {
                        update.image = file ? image.data.link : user.image
                        user.update(update)
                            .then(user => {
                                req.flash('success_msg', 'Profile was successfully updated!')
                                res.redirect(`/users/${id}`)
                            })
                    })
            })
        } else {
            return User.findByPk(id)
                .then(user => {
                    update.image = user.image
                    user.update(update)
                        .then(user => {
                            req.flash('success_msg', 'Profile was successfully updated!')
                            res.redirect(`/users/${id}`)
                        })
                })
        }
    }
}

module.exports = userController