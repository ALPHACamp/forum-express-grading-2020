"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Restaurants", "viewCounts", {
      type: Sequelize.INTEGER,
      defaultValue: false,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Restaurants", "viewCounts");
  },
};
