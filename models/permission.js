'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate({ Role }) {
      this.belongsToMany(Role, { through: 'RolePermission' })
    }
  };
  Permission.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permission',
    timestamps: false,
  });
  return Permission;
};