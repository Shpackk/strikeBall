const { Team, Request } = require('../models/index')

async function createTeam(name) {
    try {
        return await Team.create({
            name,
            players: ''
        })
    } catch (error) {
        throw error
    }
}
async function addToTeam(userId, teamId) {
    const teamDb = await Team.findOne({
        where: {
            id: teamId
        },
        attributes: ['players']
    })

    const allPlayers = Array.from(teamDb.players).filter(i => {
        if (i == ',') {
            return false
        }
        return true
    })
    //split 
    if (allPlayers.includes(userId)) {
        return "player is already in this team"

    } else {
        allPlayers.push(userId)
        teamDb.players = allPlayers.toString()
        teamDb.id = teamId
        teamDb.save()
        return `Player ${userId} joined team ${teamId}`
    }
}
// deletion from team
async function deleteFromTeam(userId, teamId) {
    const teamDb = await Team.findOne({
        where: {
            id: teamId
        },
        attributes: ['players']
    })

    const allPlayers = Array.from(teamDb.players).filter(i => {
        if ((i == ',') || (i == userId)) {
            return false
        }
        return true
    }).toString()
    teamDb.players = allPlayers
    teamDb.id = teamId
    teamDb.save()
    return `Player ${userId} left team ${teamId}`
}

async function checkUserInTeam(userId, teamId) {
    try {
        const teamDb = await Team.findOne({
            where: {
                id: teamId
            },
            attributes: ['players']
        })

        const allPlayers = Array.from(teamDb.players).filter(i => {
            if (i == ',') {
                return false
            }
            return true
        })
        if (allPlayers.includes(userId.toString())) {
            return "player is already in this team"
        }
        return false
    } catch (error) {
        throw error
    }
}

module.exports = { addToTeam, deleteFromTeam, createTeam, checkUserInTeam }