'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate({ Permission, User }) {
      this.hasMany(User)
      this.belongsToMany(Permission, { through: 'RolePermission' })
    }
  };
  Role.init({
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: false,
  });
  return Role;
};