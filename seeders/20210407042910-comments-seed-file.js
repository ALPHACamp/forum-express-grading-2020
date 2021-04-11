'use strict';
const faker = require('faker');
const fake = require('faker')
const totalUser = 3
const totalRestaurant = 50

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }).map((item, index) => ({
        id: index + 1,
        text: faker.lorem.sentence(),
        UserId: Math.floor(Math.random() * totalUser) + 1,
        RestaurantId: Math.floor(Math.random() * totalRestaurant) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null)
  }
};
