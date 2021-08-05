'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.hasMany(User)
    }
  };
  Team.init({
    name: DataTypes.STRING,
    players: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};