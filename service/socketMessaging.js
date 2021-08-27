const app = require('../app')
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } });
const dbReq = require('../DTO/userDTO/userDBrequests')

io.on('connection', (socket) => {
    console.log('socket connected ', socket.id)

})

function sendNotification(userId, msg) {
    io.emit(userId, msg)
}

async function notificationForAdmin(msg) {
    const admin = await dbReq.findAdminId()
    io.emit(admin.dataValues.id, msg)
}

async function findAndNotify(email, type) {
    const user = await dbReq.findOneByEmail(email)
    io.emit(user.id, `${type} sucessfull`)
}

async function notifyAdminManager(type) {
    await notificationForAdmin(type)
    const managers = await dbReq.findAllManagers()
    managers.forEach(manager => {
        io.emit(manager.id, type)
    });
}

server.listen(3001, () => {
    console.log('Listening')
})

module.exports = { sendNotification, notificationForAdmin, findAndNotify, notifyAdminManager }
