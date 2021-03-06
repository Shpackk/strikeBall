const service = require('../helpService')

beforeAll(async () => {
    const token = await service.loginForTests()
    return token
})

describe('patch on /user/update', () => {
    const creds = service.generateCreds()

    test('should return updated profile after patching info', async () => {
        const newUser = await service.registerUser(creds)
        const updateResponse = await service.updateInfo(creds, newUser.body.token)
        expect(updateResponse).toBeDefined()
        expect(updateResponse.body[1][0]).toEqual(
            expect.objectContaining({
                name: expect.anything()
            })
        )
        const viewUser = await service.getUser(newUser.body.id, token[0])
        expect(viewUser.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.stringContaining(creds),
                email: expect.any(String)
            })
        )
    })
    afterAll(async () => {
        await service.testUserDelete(creds)
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})


