'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }).map((item, index) =>
      ({
        text: faker.lorem.sentence(),
        UserId: Math.floor(Math.random() * 2 + 1),
        RestaurantId: Math.floor(Math.random() * 51),
        createdAt: new Date(),
        updatedAt: new Date()
      }), {})
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
