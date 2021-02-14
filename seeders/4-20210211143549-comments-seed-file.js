'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
      text: 'nice',
      RestaurantId: 1,
      UserId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: '五星好評',
      RestaurantId: 11,
      UserId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: '還OK啦',
      RestaurantId: 11,
      UserId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: '環境油膩',
      RestaurantId: 21,
      UserId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: 'great',
      RestaurantId: 31,
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      text: '非常普通',
      RestaurantId: 41,
      UserId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
