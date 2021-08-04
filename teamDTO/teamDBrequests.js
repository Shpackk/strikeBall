const Team = require('../models/Team')


async function createTeam(teamName) {
    return await Team.create({
        players: '',
        teamName
    })
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

module.exports = { addToTeam, deleteFromTeam, createTeam }