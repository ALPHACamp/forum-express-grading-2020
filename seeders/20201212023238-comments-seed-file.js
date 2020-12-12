'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 10 }).map(
        (d, i) => ({
          text: faker.lorem.word(),
          UserId: faker.random.number({ min: 1, max: 2 }),
          RestaurantId: faker.random.number({ min: 1, max: 45 }),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        {}
      )
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {});
  },
};
