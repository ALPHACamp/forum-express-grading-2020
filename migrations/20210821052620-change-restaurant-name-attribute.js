'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [1, 25]
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
};
