const Sequelize = require('sequelize')
const db = require('../config/database')

module.exports = db.define('roles', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    }
})