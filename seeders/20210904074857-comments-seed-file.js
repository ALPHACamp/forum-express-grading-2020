'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 20 }).map((d, i) => ({
        text: faker.lorem.sentence(),
        // UserId: Math.floor(Math.random() * 2 + 14),
        // RestaurantId: Math.floor(Math.random() * 49 + 106),
        UserId: Math.floor(Math.random() * 3) * 5 + 65,
        RestaurantId: Math.floor(Math.random() * 50) * 10 + 1005,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
