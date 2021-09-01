'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
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