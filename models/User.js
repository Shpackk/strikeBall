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
    static associate({ Team, Request }) {
      // define association here
      this.belongsTo(Team)
      this.hasOne(Request)
    }
  };
  User.init({
    facebookId: DataTypes.STRING,
    googleId: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};