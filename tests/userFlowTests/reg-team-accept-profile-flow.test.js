// flow of
// 1. registration
// 2. request to join team
// 3. accept by admin
// 4. view profile to check if team is correctly displayed
const app = require('../../app')
const supertest = require('supertest')

const adminToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwicm9sZUlkIjozLCJpYXQiOjE2MjkxOTczNDl9.nAMPtbEsxkrPBneuzqP4OpRfpk3O3QslnxrxT7owoQ8',
}
describe('flow of registration, join team, accept, viewing team field in profile', () => {

    test('should sucess', async () => {
        // register user
        const credentials = await registerUser()
        // check if everything is OK
        expect(credentials.statusCode).toBe(200)
        expect(credentials.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(credentials.body).toBeDefined()
        expect(credentials.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String),
                name: expect.any(String),
                roleId: expect.any(Number),
                token: expect.any(String)
            })
        )
        // apply to joinig team
        const ApplyToTeam = await applyToJoinTeam(credentials.body.token)
        // chech if everything is ok
        expect(ApplyToTeam.statusCode).toEqual(200)
        expect(ApplyToTeam.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(ApplyToTeam.body).toBeDefined()
        expect(ApplyToTeam.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        //extract request from admins account
        const request = await extractRequests()
        // check if everything is ok
        expect(request).toBeDefined()

        //accept request from admins account
        const acceptedRequest = await acceptTeamJoin(request)
        // check if everything is ok
        expect(acceptedRequest.statusCode).toEqual(200)
        expect(acceptedRequest.body).toBeDefined()
        expect(acceptedRequest.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const checkProfile = await supertest(app)
            .get('/user/profile')
            .set({ 'token': credentials.body.token })
        expect(checkProfile.statusCode).toBe(200)
        expect(checkProfile.body).toBeDefined()
        expect(checkProfile.body).toMatchObject({ Team: { id: 2, name: "B" } })
    })
})

function generateCreds() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt((Math.random() * n));
    }
    return retVal;
}

async function registerUser() {
    const credentials = generateCreds()
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
async function applyToJoinTeam(token) {
    const response = await supertest(app)
        .patch('/team/2/join')
        .set({ 'token': token })
    return response
}
async function extractRequests() {
    const response = await supertest(app)
        .get('/requests')
        .set(adminToken)
    return response.body
}

async function acceptTeamJoin(request) {
    const response = await supertest(app)
        .patch(`/requests/${request[0].id}`)
        .set(adminToken)
        .send({
            approved: true
        })
    return response
}
