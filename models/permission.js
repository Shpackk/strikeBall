'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role }) {
      // define association here
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