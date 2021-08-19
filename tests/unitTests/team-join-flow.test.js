const app = require('../../app')
const supertest = require('supertest')

const userToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsIm5hbWUiOiJ0ZXN0ZnJvbWplc3QiLCJyb2xlSWQiOjEsImlhdCI6MTYyOTI4NzE4NH0.dgQagaEK3VHguXZ2yuH2gHzH-1qWsQn96dl0er8rx30',
}
const adminToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwicm9sZUlkIjozLCJpYXQiOjE2MjkxOTczNDl9.nAMPtbEsxkrPBneuzqP4OpRfpk3O3QslnxrxT7owoQ8',
}


describe('Team join request', () => {

    test('should return message that request is done correctly', async () => {
        const response = await supertest(app)
            .patch("/team/2/join")
            .set(userToken)
        expect(response.statusCode).toEqual(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )
    })
})

describe('Non-existing team join', () => {

    test('should return error message for bad request', async () => {
        const response = await supertest(app)
            .patch('/team/4/join')
            .set(userToken)
        expect(response.statusCode).toEqual(404)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('This team doesnt exist')
            })
        )
    })
    test('should return inform that user is already applied request', async () => {
        const response = await supertest(app)
            .patch("/team/2/join")
            .set(userToken)
        expect(response.statusCode).toEqual(409)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('You already applied. Please wait until we approve.')
            })
        )
    })
})

const extractRequests = async () => {
    const response = await supertest(app)
        .get('/requests')
        .set(adminToken)
    return response.body
}

describe('solving team requests', () => {

    test('inform about error pointint to non-existing request', async () => {
        const response = await supertest(app)
            .patch(`/requests/876876876`)
            .set(adminToken)
            .send({
                approved: false
            })
        expect(response.statusCode).toEqual(404)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Not Found')
            })
        )
    })

    test('should successfully reject request', async () => {
        const arrayOfRequests = await extractRequests()
        const response = await supertest(app)
            .patch(`/requests/${arrayOfRequests[0].id}`)
            .set(adminToken)
            .send({
                approved: false
            })
        expect(response.statusCode).toEqual(200)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
        const requestsAfterReject = await extractRequests()
        expect(requestsAfterReject).toHaveLength(0)
    })
})

