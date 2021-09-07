'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banlist extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId' })
    }
  };
  Banlist.init({
    userId: DataTypes.INTEGER,
    userEmail: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Banlist',
  });
  return Banlist;
};