const dbRequest = require('../teamDTO/teamDBrequests')


function createTeam(req, res, next) {
    const { teamName } = req.body
    dbRequest.createTeam(teamName)
        .then(result => {
            res.json({
                msg: `Team ${teamName} created`,
                team: result
            })
        }).catch(error => next(error)
        )
}

async function addToTeam(req, res, next) {
    const { userId } = req.body
    const teamId = req.params.id
    try {
        const result = await dbRequest.addToTeam(userId, teamId)
        res.json({ result })
    } catch (error) {
        next(error)
    }
}
async function deleteFromTeam(req, res, next) {
    const { userId } = req.body
    const teamId = req.params.id
    try {
        const result = await dbRequest.deleteFromTeam(userId, teamId)
        res.json({ result })
    } catch (error) {
        next(error)
    }
}


module.exports = { addToTeam, deleteFromTeam, createTeam }