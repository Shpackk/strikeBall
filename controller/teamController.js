const dbRequest = require('../teamDTO/teamDBrequests')
const dbUserRequest = require('../userDTO/userDBrequests')

async function createTeam(req, res, next) {
    const { teamName } = req.body
    try {
        const createdTeam = await dbRequest.createTeam(teamName)
        res.json({
            msg: `Team ${createdTeam.dataValues.name} created`,
        })
    } catch (error) {
        next(error)
    }

}

async function joinTeam(req, res, next) {
    const { userId } = req.body
    const teamId = req.params.id
    try {
        const checkInTeam = await dbRequest.checkUserInTeam(userId, teamId)
        if (checkInTeam) {
            const error = {
                "msg": 'already in team'
            }
            throw error
        }
        const user = await dbUserRequest.findOneById(userId)
        if (user) {
            await dbUserRequest.newRequest(user.dataValues, `join team ${teamId}`)
            res.json('Sucessfully applied!')
        }
    } catch (error) {
        next(error)
    }
}
async function leaveTeam(req, res, next) {
    const { userId } = req.body
    const teamId = req.params.id
    try {
        const checkInTeam = await dbRequest.checkUserInTeam(userId, teamId)
        if (checkInTeam) {
            const user = await dbUserRequest.findOneById(userId)
            if (user) {
                await dbUserRequest.newRequest(user.dataValues, `leave team ${teamId}`)
                res.json('Sucessfully applied!')
            }
        }
        if (checkInTeam == false) {
            const error = {
                "msg": 'in team'
            }
            throw error
        }
    } catch (error) {
        next(error)
    }
}


module.exports = { joinTeam, leaveTeam, createTeam }