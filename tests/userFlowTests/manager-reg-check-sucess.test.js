const app = require('../../app')
const supertest = require('supertest')

const adminToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwicm9sZUlkIjozLCJpYXQiOjE2Mjg3NzIxNDV9.SlgSeMDZ2mka85mND12MHaXhRlZCUW4ZMRXF4FPH9FM',
}

describe('Manager registration and checking if he is added to all managers', () => {

    test('should register manager and check if he is in a list', async () => {
        const managersPrev = await getManagers()
        expect(managersPrev.statusCode).toBe(200)
        expect(managersPrev.body).toBeDefined()
        expect(managersPrev.body).toBeInstanceOf(Array)

        const regResponse = await regManager()
        expect(regResponse.statusCode).toBe(201)
        expect(regResponse.body).toBeDefined
        expect(regResponse.body).toEqual(
            expect.objectContaining({
                message: "You sucessfully applied!"
            })
        )

        const getReqAsAdmin = await extractRequest()
        expect(getReqAsAdmin.statusCode).toBe(200)
        expect(getReqAsAdmin.body).toBeDefined()
        expect(getReqAsAdmin.body).toBeInstanceOf(Array)

        const acceptResponse = await acceptRequest(getReqAsAdmin.body[0].id)
        expect(acceptResponse.statusCode).toBe(200)
        expect(acceptResponse.body).toBeDefined()
        expect(acceptResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const managersNew = await getManagers()
        expect(managersNew.statusCode).toBe(200)
        expect(managersNew.body).toBeDefined()
        expect(managersNew.body).toBeInstanceOf(Array)

        expect(managersNew.body > managersPrev.body).toBeTruthy()

    })
})

async function getManagers() {
    const response = await supertest(app)
        .get('/managers')
        .set(adminToken)
    return response
}

async function regManager() {
    const creds = generateCreds()
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
        .set(adminToken)
    return response
}

async function acceptRequest(id) {
    const response = await supertest(app)
        .patch(`/requests/${id}`)
        .set(adminToken)
        .send({
            approved: true
        })
    return response
}

function generateCreds() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt((Math.random() * n));
    }
    return retVal;
}