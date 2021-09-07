'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    static associate({ User }) {
      this.belongsTo(User)
    }
  };
  Request.init({
    status: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    userName: DataTypes.STRING,
    userPass: DataTypes.STRING,
    requestType: DataTypes.ENUM('join', 'leave', 'register'),
    teamId: DataTypes.INTEGER,
    approved: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Request',
  });
  return Request;
};