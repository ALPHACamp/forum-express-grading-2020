'use strict';
const { User, Restaurant } = require('../models');
const comment = require('../models/comment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let root = await User.findOne({ where: { name: 'root' } });
    let user1 = await User.findOne({ where: { name: 'user1' } });
    let restaurants = await Restaurant.findAll({ raw: true, nest: true, limit: 4 });

    let comment_seed = [];
    [root.toJSON(), user1.toJSON()].forEach((user) => {
      comment_seed = [...restaurants.map(r => ({
        text: 'default comment',
        UserId: user.id,
        RestaurantId: r.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })), ...comment_seed]
    })

    await queryInterface.bulkInsert('Comments', comment_seed)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
