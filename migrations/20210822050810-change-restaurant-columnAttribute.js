'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      len: [1, 100]
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      len: [1, 25]
    })
  }
};
