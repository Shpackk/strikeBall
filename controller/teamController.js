const dbRequest = require('../DTO/teamDTO/teamDBrequests')
const dbUserRequest = require('../DTO/userDTO/userDBrequests')
const mailer = require('../service/mailMessageHandler')
const socket = require('../service/socketMessaging')
const mongoLog = require('../service/mongoLogsSaver.js')


async function createTeam(req, res, next) {
    const { teamName } = req.body
    try {
        const createdTeam = await dbRequest.createTeam(teamName)
        res.json({
            message: `Team ${createdTeam.dataValues.name} created`,
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
            throw { msg: 'already in team' }
        }
        const user = await dbUserRequest.findOneById(userId)
        if (user) {
            await dbUserRequest.newRequest(user.dataValues, `join team ${teamId}`)
            socket.notifyAdminManager('jointeam')
            res.status(200).json({ message: "Sucessfully applied!" })
        }
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
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
                socket.notifyAdminManager('teamleave')
                res.status(200).json({ message: "Sucessfully applied!" })
            }
        } else throw { msg: 'not in team' }
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

async function viewPlayersInTeam(req, res, next) {
    const teamId = req.params.id
    try {
        const users = await dbUserRequest.getUsersByTeam(teamId)
        res.status(200).json(users)
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
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
        if (user.dataValues.Team) {
            await dbRequest.deleteFromTeam(userId, user.dataValues.Team.dataValues.id)
        } else {
            throw { msg: 'teamkick' }
        }
        res.status(200).json({ "message": `User ${userEmail} sucessfully kicked from team ${teamId}` })
        await mailer.sandMail(userEmail, 'Kicked from Team', kickReason)
        socket.sendNotification(userId, 'You were kicked from team')
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}


module.exports = { joinTeam, leaveTeam, createTeam, viewPlayersInTeam, kickPlayerFromTeam }