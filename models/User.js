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
    static associate({ Team, Request, Banlist, Role }) {
      // define association here
      this.belongsTo(Role)
      this.belongsTo(Team)
      this.hasOne(Request)
      this.hasOne(Banlist, { foreignKey: 'userId' })
    }
  };
  User.init({
    facebookId: DataTypes.STRING,
    googleId: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};