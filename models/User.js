const Sequelize = require('sequelize')
const db = require('../config/database')
// db user model
const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    facebookId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    googleId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    picture: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = User