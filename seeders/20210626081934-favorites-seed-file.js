'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Favorites',
      Array.from({ length: 20 }).map((item, index) =>
      ({
        UserId: ~~(Math.random() * 2) + 1,
        RestaurantId: ~~(Math.random() * 50) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Favorites', {})
  }
};
