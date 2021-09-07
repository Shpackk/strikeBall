'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    static associate({ User }) {
      this.hasMany(User, { foreignKey: 'teamId' })
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