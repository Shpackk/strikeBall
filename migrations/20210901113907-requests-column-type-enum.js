'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface
      .changeColumn('Requests', 'requestType', {
        type: Sequelize.ENUM('join', 'leave', 'register'),
        allowNull: true
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface
      .changeColumn('Requests', 'requestType', {
        type: Sequelize.STRING,
        allowNull: false
      });
  }
};
