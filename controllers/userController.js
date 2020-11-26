const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage (req, res) {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    try {
      const { name, email, password } = req.body
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
        .then(user => res.redirect('/signin'))
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = userController
