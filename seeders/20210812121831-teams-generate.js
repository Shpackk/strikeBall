'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Teams', [{
      name: 'A',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      name: 'B',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Teams', null, {});
  }
};
