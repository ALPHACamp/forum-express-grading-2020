'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
<<<<<<< HEAD
      // define association here
=======
      User.hasMany(models.Comment);
>>>>>>> A19-test
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
<<<<<<< HEAD
=======
      image: DataTypes.STRING,
>>>>>>> A19-test
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
