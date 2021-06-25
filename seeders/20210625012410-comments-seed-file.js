'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 5 }).map((d, i) =>
      ({
        text: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: 1,
        RestaurantId: Math.floor(Math.random() * 50) + 1
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
