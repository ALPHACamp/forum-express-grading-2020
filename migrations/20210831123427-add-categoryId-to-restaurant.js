'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Restaurants', 'CategoryId', {
      type: Sequelize.INTEGER
    })
    await queryInterface.bulkUpdate(
      'Restaurants',
      {
        CategoryId: Math.floor(Math.random() * 6) * 10 + 1 // 預設為 1, 假設 Categories 有 id 1 的資料
      },
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Restaurants', 'CategoryId')
  }
}
