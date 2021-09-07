'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }).map((d, i) =>
      ({
        text: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        // if local : Math.floor(Math.random() * 3) + 1
        // if heroku : Math.floor(Math.random() * 3) * 10 + 5
        UserId: Math.floor(Math.random() * 3) * 10 + 5,
        //if local : Math.floor(Math.random() * 50) + 1
        //if heroku : Math.floor(Math.random() * 50) * 10 + 5
        RestaurantId: Math.floor(Math.random() * 50) * 10 + 5
      })
      ), { })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, { })
  }
}
