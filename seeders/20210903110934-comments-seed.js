'use strict'
const faker = require('faker')
//
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 5 }).map((d, i) =>
        ({
          text: faker.lorem.text().substring(0, 20),
          createdAt: new Date(),
          updatedAt: new Date(),
          restaurantId: Math.floor(Math.random() * 50) + 1,
          userId: Math.floor(Math.random() * 3) + 1
        })
      ), {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
