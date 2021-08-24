const bcrypt = require('bcryptjs')
const db = require('../models/index')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUp')
  },

  signUp: (req, res) => {
    console.log(req.body)
    const { name, email } = req.body
    User.create({
      name,
      email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }).then(user => res.redirect('/signIn'))
  }
}

module.exports = userController
