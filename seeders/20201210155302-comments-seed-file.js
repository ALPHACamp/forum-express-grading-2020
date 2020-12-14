'use strict';
const db = require('../models')
const User = db.User

const commentList = ["Good one", "Nice try", "Noisy", "Too good to be true", "Fair price", "I will be back", "You are the best!"]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 50 }).map((d, i) =>
        ({
          id: i + 1,
          text: commentList[Math.floor(Math.random() * 6)],
          UserId: Math.floor(Math.random() * 3) + 1,
          RestaurantId: Math.floor(Math.random() * 50) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
