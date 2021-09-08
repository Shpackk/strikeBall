'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Team, Request, Banlist, Role }) {
      this.belongsTo(Role, { as: 'role', foreignKey: 'roleId' })
      this.belongsTo(Team, { as: 'team', foreignKey: 'teamId' })
      this.hasOne(Request)
      this.hasOne(Banlist, { as: 'banlist', foreignKey: 'userId' })
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