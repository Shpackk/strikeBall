const Team = require('../models/Team')


async function createTeam(teamName) {
    return await Team.create({
        players: '',
        teamName
    })
}
async function addToTeam(id, teamName) {
    return await Team.update({ id: id + "," }, {
        where: {
            teamName
        }
    })
}
async function deleteFromTeam(id, team) {
    return await Team.destroy({
        id,
        teamName: team
    })
}

module.exports = { addToTeam, deleteFromTeam, createTeam }