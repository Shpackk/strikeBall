const dbRequest = require('../DTO/teamDTO/teamDBrequests')
const dbUserRequest = require('../DTO/userDTO/userDBrequests')
const mailer = require('../service/mailMessageHandler')

async function createTeam(req, res, next) {
    const { teamName } = req.body
    try {
        const createdTeam = await dbRequest.createTeam(teamName)
        res.json({
            "message": `Team ${createdTeam.dataValues.name} created`,
        })
    } catch (error) {
        next(error)
    }

}

async function joinTeam(req, res, next) {
    const userId = req.user.id
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
            res.status(200).json({ "message": "Sucessfully applied!" })
        }
    } catch (error) {
        next(error)
    }
}
async function leaveTeam(req, res, next) {
    const userId = req.user.id
    const teamId = req.params.id
    try {
        const checkInTeam = await dbRequest.checkUserInTeam(userId, teamId)
        if (checkInTeam) {
            const user = await dbUserRequest.findOneById(userId)
            if (user) {
                await dbUserRequest.newRequest(user.dataValues, `leave team ${teamId}`)
                res.json({ "message": "Sucessfully applied!" })
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
        res.json({ "message": `User ${userEmail} sucessfully kicked from team ${teamId}` })
    } catch (error) {
        error.msg = "teamkick"
        next(error)
    }
}


module.exports = { joinTeam, leaveTeam, createTeam, viewPlayersInTeam, kickPlayerFromTeam }