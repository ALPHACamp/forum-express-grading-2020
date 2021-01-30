const bcrypt = require('bcryptjs');
const db = require('../models');

const { User } = db;

const userController = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res) => {
    console.log(req);

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
    }).then((user) => res.redirect('/signin'));
  },
};

module.exports = userController;
