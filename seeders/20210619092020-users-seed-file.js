'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      ['root', 'user1', 'user2']
        .map((item, index) =>
        ({
          id: index * 10 + 1,
          email: item + '@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          isAdmin: index === 0 ? true : false,
          name: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
