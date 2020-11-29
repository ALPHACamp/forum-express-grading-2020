'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'name', { type: Sequelize.STRING, allowNull: true })
    await queryInterface.changeColumn('Users', 'email', { type: Sequelize.STRING, allowNull: true })
    await queryInterface.changeColumn('Users', 'password', { type: Sequelize.STRING, allowNull: true })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'name', { type: Sequelize.STRING, allowNull: false })
    await queryInterface.changeColumn('Users', 'email', { type: Sequelize.STRING, allowNull: false })
    await queryInterface.changeColumn('Users', 'password', { type: Sequelize.STRING, allowNull: false })
  }
};