'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
        text: '會想再來!!',
        UserId: 4,
        RestaurantId: 203,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: '難吃到爆!!',
        UserId: 4,
        RestaurantId: 204,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: '米其林1星!!',
        UserId: 4,
        RestaurantId: 203,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
