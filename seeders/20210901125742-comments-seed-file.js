const faker = require('faker')
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }).map((d, i) =>
        ({
          text: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
          // UserId: Math.floor(Math.random() * 3) * 10 + 5,
          UserId: Math.floor(Math.random() * 3) + 1,
          // RestaurantId: Math.floor(Math.random() * 50) * 10 + 10
          RestaurantId: Math.floor(Math.random() * 50) + 1
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
