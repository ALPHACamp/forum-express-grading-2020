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
        foreignKey: 'UserId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedRestaurants'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: {
      type: DataTypes.STRING,
      defaultValue: 'https://fakeimg.pl/350x200/ff0000/000,255'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};