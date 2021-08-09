const dbRequest = require('../teamDTO/teamDBrequests')
const dbUserRequest = require('../userDTO/userDBrequests')
const mailer = require('../service/nodeMailer')

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
                "msg": 'not in team'
            }
            throw error
        }
    } catch (error) {
        next(error)
    }
}

async function viewPlayersInTeam(req, res, next) {
    const teamId = req.params.id
    try {
        const users = await dbUserRequest.getUsersByTeam(teamId)
        res.json(users)
    } catch (error) {
        next(error)
    }
}

async function kickPlayerFromTeam(req, res, next) {
    const teamId = req.params.id
    const { userId, kickReason } = req.body
    try {
        const user = await dbUserRequest.findOneById(userId)
        const userEmail = user.dataValues.email
        const checkIn = await dbRequest.checkUserInTeam(userId, teamId)
        if (checkIn == false) {
            throw error
        }
        await dbRequest.deleteFromTeam(userId, teamId)
        mailer.sandMail(userEmail, 'Kicked from Team', kickReason)
        res.json(`User ${user.dataValues.name} sucessfully kicked from team ${teamId}`)
    } catch (error) {
        error.msg = "teamkick"
        next(error)
    }
}


module.exports = { joinTeam, leaveTeam, createTeam, viewPlayersInTeam, kickPlayerFromTeam }