'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate (models) {
    }
  };
  Comment.init({
    text: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment'
  })
  return Comment
}
