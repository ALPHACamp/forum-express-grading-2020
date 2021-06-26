'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }).map((item, index) =>
      ({
        text: faker.lorem.words(10),
        UserId: ~~(Math.random() * 3) + 1,
        RestaurantId: ~~(Math.random() * 50) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
};
