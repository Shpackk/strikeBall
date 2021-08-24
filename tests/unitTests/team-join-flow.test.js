const service = require('../helpService')

describe('Team join request', () => {

    test('should return message that request is done correctly', async () => {
        const response = await service.applyToJoinTeam()
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
        const response = await service.nonExistingTeam()
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
        const response = await service.applyToJoinTeam()
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


describe('solving team requests', () => {

    test('inform about error pointint to non-existing request', async () => {
        const response = await service.nonExistingRequest()
        expect(response.statusCode).toEqual(404)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Not Found')
            })
        )
    })

    test('should successfully reject request', async () => {
        const { body } = await service.extractRequest()
        const response = await service.declineRequest(body[0].id)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
        const requestsAfterReject = await service.extractRequest()
        expect(requestsAfterReject.body).toHaveLength(0)
    })
})

afterAll(() => {
    service.closeConnection()
})

