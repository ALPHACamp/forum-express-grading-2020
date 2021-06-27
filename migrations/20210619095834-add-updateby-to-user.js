'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'updated_by', {
      type: Sequelize.INTEGER,
      // reference: {
      //   model: 'Users',
      //   key: 'id'
      // }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'updated_by');
  }
};
