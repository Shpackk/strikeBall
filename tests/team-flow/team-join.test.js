const service = require('../helpService')

beforeAll(async () => {
    const token = await service.loginForTests()
    return token
})
describe('Team join request', () => {
    test('should return message that request is done correctly', async () => {
        const response = await service.applyToJoinTeam(token[1].token)
        expect(response.statusCode).toEqual(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )
    })
    test('should return error message for bad request', async () => {
        const response = await service.nonExistingTeam(token[1])
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
        const response = await service.applyToJoinTeam(token[1].token)
        expect(response.statusCode).toEqual(409)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('You already applied. Please wait until we approve.')
            })
        )
    })
    test('inform about error pointint to non-existing request', async () => {
        const response = await service.nonExistingRequest(token[0])
        expect(response.statusCode).toEqual(404)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Not Found')
            })
        )
    })
    test('should successfully reject request', async () => {
        const { body } = await service.extractRequest(token[0])
        const response = await service.declineRequest(body[0].id, token[0])
        expect(response.statusCode).toEqual(200)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
        const requestsAfterReject = await service.extractRequest(token[0])
        expect(requestsAfterReject.body).toHaveLength(0)
    })
})
afterAll(async () => {
    await service.testUserDelete('fortestpurpose')
    service.closeConnection()
})

