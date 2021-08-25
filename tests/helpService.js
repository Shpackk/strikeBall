const app = require('../app')
const supertest = require('supertest')
const db = require('../models/index')
const { User } = require('../models/index')



beforeAll(async () => {
    const admin = await supertest(app)
        .post('/login')
        .send({
            name: 'admin',
            password: 'admin'
        })
    const user = await supertest(app)
        .post('/signup')
        .send({
            name: 'fortestpurpose',
            email: 'fortestpurpose@gmail.com',
            role: 'user',
            password: 'admin'
        })
    return token = [
        { token: admin.body.token },
        { token: user.body.token },
    ]
})


function generateCreds() {
    const length = 10,
        charset = "abcdefghijklmnopqrstuvwxyz";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt((Math.random() * n));
    }
    return retVal;
}

//1111111111
async function getAllUsers() {
    const users = await supertest(app)
        .get('/users')
        .set(token[0])
    return users
}


async function banUser(id) {
    const bannedUser = await supertest(app)
        .post(`/user/${id}/ban`)
        .set(token[0])
        .send({
            description: 'badhuman',
            type: 'ban'
        })
    return bannedUser
}

async function viewBannedUser(id) {
    const bannedUser = await supertest(app)
        .get(`/user/${id}`)
        .set(token[0])
    return bannedUser
}


async function unBanUser(id) {
    const unbannedUser = await supertest(app)
        .post(`/user/${id}/ban`)
        .set(token[0])
        .send({
            description: 'missclick',
            type: 'unban'
        })
    return unbannedUser
}
// 222222222222
async function createRequest() {
    const response = await supertest(app)
        .patch('/team/1/join')
        .set(token[1])
    return response
}

async function viewMyRequests() {
    const response = await supertest(app)
        .get('/user/requests')
        .set(token[1])
    return response
}

async function deleteRequest(id) {
    const response = await supertest(app)
        .delete(`/user/requests/delete/${id}`)
        .set(token[1])
    return response
}
//33333333333
async function getManagers() {
    const response = await supertest(app)
        .get('/managers')
        .set(token[0])
    return response
}

async function regManager(creds) {
    const response = await supertest(app)
        .post('/signup')
        .send({
            name: creds,
            email: creds + '@gmail.com',
            role: 'manager',
            password: creds
        })
    return response
}

async function extractRequest() {
    const response = await supertest(app)
        .get('/requests')
        .set(token[0])
    return response
}

async function acceptRequest(id) {
    const response = await supertest(app)
        .patch(`/requests/${id}`)
        .set(token[0])
        .send({
            approved: true
        })
    return response
}
async function declineRequest(id) {
    const response = await supertest(app)
        .patch(`/requests/${id}`)
        .set(token[0])
        .send({
            approved: false
        })
    return response
}
// 444444444
async function updateInfo(creds, token) {
    const response = await supertest(app)
        .patch('/user/update')
        .set({ token })
        .send({
            email: creds + "@gmail.com",
            newPassword: creds,
            confirmPassword: creds
        })
    return response
}
async function getUser(id) {
    const response = await supertest(app)
        .get(`/user/${id}`)
        .set(token[0])
    return response
}
//55555555555
async function registerUser(credentials = generateCreds()) {
    const response = await supertest(app)
        .post("/signup")
        .send({
            name: credentials,
            email: credentials + "@google.com",
            role: "user",
            password: credentials
        })
    return response
}
async function applyToJoinTeam(tok = token[1].token) {
    const response = await supertest(app)
        .patch('/team/1/join')
        .set({ 'token': tok })
    return response
}

async function nonExistingTeam() {
    const response = await supertest(app)
        .patch('/team/424345/join')
        .set(token[1])
    return response
}

async function nonExistingRequest() {
    const response = await supertest(app)
        .patch(`/requests/876876876`)
        .set(token[0])
        .send({
            approved: false
        })
    return response
}

async function acceptTeamJoin(request) {
    const response = await supertest(app)
        .patch(`/requests/${request.body[0].id}`)
        .set(token[0])
        .send({
            approved: true
        })
    return response
}
async function checkProfile(tok = token[1]) {
    const response = await supertest(app)
        .get('/user/profile')
        .set(tok)
    return response
}

async function applyToLeaveTeam() {
    const response = await supertest(app)
        .delete('/team/1/leave')
        .set(token[1])
    return response
}
async function playersByTeam() {
    const users = await supertest(app)
        .get('/team/1/players')
        .set(token[0])
    return users
}

async function kickUserFromTeam(id) {
    const kick = await supertest(app)
        .delete('/team/1/kick')
        .set(token[0])
        .send({
            userId: id,
            kickReason: 'innactivity'
        })
    return kick
}

async function testUserDelete(name) {
    await User.destroy({
        where: {
            name
        }
    })
}

async function loginUser(name, password) {
    const response = await supertest(app)
        .post("/login")
        .send({
            name,
            password
        })
    return response
}

async function createTestUsers(user) {
    return await User.create(user)
}



function closeConnection() {
    db.sequelize.close()
}


module.exports = {
    loginUser,
    createTestUsers,
    testUserDelete,
    closeConnection,
    declineRequest,
    nonExistingRequest,
    nonExistingTeam,
    playersByTeam,
    kickUserFromTeam,
    applyToLeaveTeam,
    checkProfile,
    registerUser,
    acceptTeamJoin,
    applyToJoinTeam,
    getUser,
    updateInfo,
    createRequest,
    viewMyRequests,
    deleteRequest,
    generateCreds,
    getAllUsers,
    banUser,
    viewBannedUser,
    unBanUser,
    acceptRequest,
    extractRequest,
    regManager,
    getManagers
}