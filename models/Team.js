const Sequelize = require('sequelize')
const db = require('../config/database')
// const User = require('../models/User')

const Team = db.define('team', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    players: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Team.hasMany(User)
module.exports = Team

