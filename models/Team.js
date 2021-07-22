const Sequelize = require('sequelize')
const db = require('../config/database')

module.exports = db.define('team', {
    id: {
        type: // ARRAY?, string array! => map when accesing
            autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    teamName: {
        type: Sequelize.STRING,
        allowNull: false
    }
})