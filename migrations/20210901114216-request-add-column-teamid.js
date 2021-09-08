'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Requests',
      'teamId',
      Sequelize.INTEGER
    );
  },

  down: async (queryInterface, Sequelize) => {

    return queryInterface.removeColumn(
      'Requests',
      'teamId'
    );
  }
};
