'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.imgur.com/eNQO9Ra.png'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: null
    })
  }
};