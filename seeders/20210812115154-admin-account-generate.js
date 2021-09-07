'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'admin',
      email: 'admin@google.com',
      password: '$2a$10$WCDrlQwOsSIFrglX8Hx7iOU43EoI2EdYmfCKurKgO03ZGJ6eoPyJ.',
      roleId: '3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
