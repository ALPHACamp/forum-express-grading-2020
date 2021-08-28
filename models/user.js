'use strict';
const bcrypt = require('bcryptjs');

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
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    image: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: async (User, next) => {
        const password = User.dataValues.password
        if (password) {
          try {
            const salt = await bcrypt.genSalt(10)
            User.dataValues.password = await bcrypt.hash(password, salt)
          }
          catch (error) {
            console.log(error)
          }
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};