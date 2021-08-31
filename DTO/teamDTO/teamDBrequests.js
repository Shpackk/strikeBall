const { Team, User } = require('../../models/index')

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
    try {
        const teamDb = await Team.findOne({
            where: {
                id: teamId
            },
            attributes: ['players']
        })
        if (teamDb.players != null) {
            const allPlayers = teamDb.players.split(',').map(Number).filter(i => {
                if (i === 0) {
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
        } else {
            teamDb.players = userId
            teamDb.id = teamId
            teamDb.save()
            return `Player ${userId} joined team ${teamId}`
        }
    } catch (error) {
        throw error
    }
}
// deletion from team
async function deleteFromTeam(userId, teamId) {
    try {
        const teamDb = await Team.findOne({
            where: {
                id: teamId
            },
            attributes: ['players']
        })
        const allPlayers = teamDb.players.split(',').map(Number).filter(i => {
            if (i == userId) {
                return false
            }
            return true
        }).toString()

        teamDb.players = allPlayers;
        teamDb.id = teamId
        teamDb.save()

        await User.update({ TeamId: null }, {
            where: {
                id: userId
            }
        })
        return `Player ${userId} left team ${teamId}`
    } catch (error) {
        throw error
    }

}

async function checkUserInTeam(userId, teamId) {
    try {
        const teamDb = await Team.findOne({
            where: {
                id: teamId
            },
            attributes: ['players']
        })
        if (teamDb == null) {
            throw { msg: 'No such team' }
        }
        if (teamDb.players == null) {
            return false
        }
        const allPlayers = teamDb.players.split(',').map(Number)
        if (allPlayers.includes(userId)) {
            return "player is already in this team"
        }
        return false
    } catch (error) {
        throw error
    }
}


module.exports = {
    addToTeam, deleteFromTeam, createTeam, checkUserInTeam,
}