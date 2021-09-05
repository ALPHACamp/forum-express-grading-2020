'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'CategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
    // 維護舊資料
    await queryInterface.bulkUpdate('Restaurants',
      {
        CategoryId: 1, // 預設為 1, 假設 Categories 有 id 1 的資料
      }
    )

    await queryInterface.bulkUpdate('Categories',
      {
        id: 1, // 預設為 1, 假設 Categories 有 id 1 的資料
        name: 'pizza',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    )

    // 加 Constraint
    await queryInterface.addConstraint('Restaurants', {
      fields: ['CategoryId'],
      type: 'foreign key',
      references: {
        table: 'Categories',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'CategoryId')
    await queryInterface.removeConstraint('Restaurants', 'CategoryId')
  }
}
