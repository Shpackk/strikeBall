const Sequelize = require('sequelize')
const db = require('../config/database')
const User = require('../models/User')

const Team = db.define('team', {
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

// Team.hasMany(User)
module.exports = Team
