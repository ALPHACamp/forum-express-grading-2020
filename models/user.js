'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Comment)
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        ForeignKey: 'UserId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        ForeignKey: 'UserId',
        as: 'LikedRestaurants'
      })
      User.belongsToMany(models.User, {
        through: Followship,
        ForeignKey: 'followerId',
        as: 'followings'
      })
      User.belongsToMany(models.User, {
        through: Followship,
        ForeignKey: 'followingId',
        as: 'followers'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};