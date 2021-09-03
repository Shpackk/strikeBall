const db = require('../models/index')
const app = require('../app')
const data = require('../tests/testUsersData')
const { User } = require('../models/index')
const supertest = require('supertest')
const passControl = require('../service/passwordService')

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
async function getAllUsers(token) {
    const users = await supertest(app)
        .get('/users')
        .set(token)
    return users
}


async function banUser(id, token) {
    const bannedUser = await supertest(app)
        .post(`/user/${id}/ban`)
        .set(token)
        .send({
            description: 'badhuman',
            type: 'ban'
        })
    return bannedUser
}

async function viewBannedUser(id, token) {
    const bannedUser = await supertest(app)
        .get(`/user/${id}`)
        .set(token)
    return bannedUser
}


async function unBanUser(id, token) {
    const unbannedUser = await supertest(app)
        .post(`/user/${id}/ban`)
        .set(token)
        .send({
            description: 'missclick',
            type: 'unban'
        })
    return unbannedUser
}
// 222222222222
async function createRequest(token) {
    const response = await supertest(app)
        .patch('/team/1/join')
        .set(token)
    return response
}

async function viewMyRequests(token) {
    const response = await supertest(app)
        .get('/user/requests')
        .set(token)
    return response
}

async function deleteRequest(id, token) {
    const response = await supertest(app)
        .delete(`/user/requests/delete/${id}`)
        .set(token)
    return response
}
//33333333333
async function getManagers(token) {
    const response = await supertest(app)
        .get('/managers')
        .set(token)
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

async function extractRequest(token) {
    const response = await supertest(app)
        .get('/requests')
        .set(token)
    return response
}

async function acceptRequest(id, token) {
    const response = await supertest(app)
        .patch(`/requests/${id}`)
        .set(token)
        .send({
            approved: true
        })
    return response
}
async function declineRequest(id, token) {
    const response = await supertest(app)
        .patch(`/requests/${id}`)
        .set(token)
        .send({
            approved: false
        })
    return response
}
// 444444444
async function updateInfo(creds, token) {
    //token passed fron outside not from logging in beforeAll
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
async function getUser(id, token) {
    const response = await supertest(app)
        .get(`/user/${id}`)
        .set(token)
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
async function applyToJoinTeam(tok) {
    //token passed fron outside not from logging in beforeAll
    const response = await supertest(app)
        .patch('/team/1/join')
        .set({ 'token': tok })
    return response
}

async function nonExistingTeam(token) {
    const response = await supertest(app)
        .patch('/team/424345/join')
        .set(token)
    return response
}

async function nonExistingRequest(token) {
    const response = await supertest(app)
        .patch(`/requests/876876876`)
        .set(token)
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
async function checkProfile(token) {
    const response = await supertest(app)
        .get('/user/profile')
        .set(token)
    return response
}

async function applyToLeaveTeam(token) {
    const response = await supertest(app)
        .delete('/team/1/leave')
        .set(token)
    return response
}
async function playersByTeam(token) {
    const users = await supertest(app)
        .get('/team/1/players')
        .set(token)
    return users
}

async function kickUserFromTeam(id, token) {
    const kick = await supertest(app)
        .delete('/team/1/kick')
        .set(token)
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
// 788888888888888888888888888888888

//7777777777777777777777777
async function createTestUsers() {
    const newManager = { ...data.testManager, password: await passControl.hash(data.testManager.password) };
    const newUserr = { ...data.testUserTwo, password: await passControl.hash(data.testUserTwo.password) };
    const newUser = { ...data.testUser, password: await passControl.hash(data.testUser.password) };
    await User.create(newManager)
    await User.create(newUserr)
    return await User.create(newUser)
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