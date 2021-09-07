const { Banlist } = require('../../models/index')

async function isBanned(userEmail) {
    try {
        return await Banlist.findOne({
            where: {
                userEmail: userEmail
            }
        })
    } catch (error) {
        throw error
    }
}

async function banUser(userId, description, userEmail) {
    try {
        return await Banlist.create({
            userId,
            description,
            userEmail
        })
    } catch (error) {
        throw error
    }
}

async function unbanUser(userId) {
    try {
        return await Banlist.destroy({
            where: {
                userId
            }
        })
    } catch (error) {
        throw error
    }
}
module.exports = { banUser, isBanned, unbanUser }