const dbRequest = require('../teamDTO/teamDBrequests')


function createTeam(req, res, next) {
    const { teamName } = req.body
    dbRequest.createTeam(teamName)
        .then(result => {
            res.json({
                msg: `Team ${teamName} created`,
                team: result
            })
        }).catch(error => {
            console.log(error)
        })
}

function addToTeam(req, res, next) {
    const { id, team } = req.body
    // check for valid input
    dbRequest.addToTeam(id, team)
        .then(result => {
            res.json({
                msg: result
            })
        })
}
function deleteFromTeam(req, res, next) {
    const { id, team } = req.body
    // check for valid input
    dbRequest.addToTeam(id, team)
        .then(result => {
            res.json({
                msg: result
            })
        })
}

module.exports = { addToTeam, deleteFromTeam, createTeam }