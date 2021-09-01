// no saved data after test
const app = require('../../app')
const data = require('../testUsersData')
const service = require('../helpService')
const supertest = require('supertest')

beforeAll(async () => {
    const admin = await supertest(app)
        .post('/login')
        .send(data.adminCreds)
    const user = await supertest(app)
        .post('/signup')
        .send(data.AnotherUser)
    return token = [
        { token: admin.body.token },
        { token: user.body.token },
    ]
})

describe('user requests manipulate', () => {

    test('should return sucess if request created, extracted and deleted', async () => {
        const createReqResponse = await service.createRequest(token[1])
        expect(createReqResponse.statusCode).toEqual(200)
        expect(createReqResponse.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(createReqResponse.body).toBeDefined()
        expect(createReqResponse.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        const getMyRequest = await service.viewMyRequests(token[1])
        expect(getMyRequest.statusCode).toBe(200)
        expect(getMyRequest.body).toBeDefined()
        expect(getMyRequest.body).toHaveLength(1)
        expect(getMyRequest.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    requestType: expect.stringMatching('join')
                })
            ])
        )

        const delReqResponse = await service.deleteRequest(getMyRequest.body[0].id, token[1])
        expect(delReqResponse.statusCode).toBe(200)
        expect(delReqResponse.body).toBeDefined()
        expect(delReqResponse.body).toEqual(
            expect.objectContaining({
                message: "Request is sucessfully deleted"
            })
        )
    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})
