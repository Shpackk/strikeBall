'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('teams', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('teams', {
      teamName: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      players: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('teams');
     */
    await queryInterface.dropTable('teams')
  }
};
