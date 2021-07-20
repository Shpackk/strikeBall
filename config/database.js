require('dotenv').config()
const Sequelize = require('sequelize')

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: process.env.DB_DIALECT,
    host: process.env.HOST
})
