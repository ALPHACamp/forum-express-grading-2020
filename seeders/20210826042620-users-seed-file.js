'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
      image: `https://loremflickr.com/320/240/boy/?random=${Math.random() * 100}`
    }, {
      email: 'User1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'User1',
      createdAt: new Date(),
      updatedAt: new Date(),
      image: `https://loremflickr.com/320/240/boy/?random=${Math.random() * 100}`
    }, {
      email:'User2@example.com' ,
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'User2',
      createdAt: new Date(),
      updatedAt: new Date(),
      image: `https://loremflickr.com/320/240/boy/?random=${Math.random() * 100}`
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
