const app = require('../../app')
const supertest = require('supertest')

const adminToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwicm9sZUlkIjozLCJpYXQiOjE2Mjg3NzIxNDV9.SlgSeMDZ2mka85mND12MHaXhRlZCUW4ZMRXF4FPH9FM',
}
const userToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsIm5hbWUiOiJtYW5hZ2VyY29vbG9vIiwicm9sZUlkIjoyLCJpYXQiOjE2Mjk2Nzc2ODh9.tM8GF7Kt6_-3oJ-ZmDB6iZijnXiM4uigcMlCcItibIM'
}

describe('df', () => {

    test('dff', async () => {
        const creds = generateCreds()

        const updateResponse = await updateInfo(creds)
        expect(updateResponse).toBeDefined()
        expect(updateResponse.body[1][0]).toEqual(
            expect.objectContaining({
                name: expect.anything()
            })
        )

        const viewManager = await getManager()
        expect(viewManager.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.stringContaining(creds),
                email: expect.any(String)
            })
        )

    })
})

async function updateInfo(creds) {
    const response = await supertest(app)
        .patch('/user/update')
        .set(userToken)
        .send({
            name: creds,
            email: creds + "@gmail.com",
            newPassword: creds,
            confirmPassword: creds
        })
    return response
}
async function getManager() {
    const response = await supertest(app)
        .get(`/manager/${62}`)
        .set(adminToken)
    return response
}

function generateCreds() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyz0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt((Math.random() * n));
    }
    return retVal;
}