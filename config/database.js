const Sequelize = require('sequelize')

module.exports = new Sequelize('users', 'postgres', '123456789', {
    dialect: "postgres",
    host: "localhost"
})
