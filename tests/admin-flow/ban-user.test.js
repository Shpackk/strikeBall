// no data saved after test
const service = require('../helpService')

beforeAll(async () => {
    const token = await service.loginForTests()
    return token
})
describe('POST on /user/:id/ban', () => {

    test('get random user, ban, check if ban-field is not empty', async () => {
        const retrievedUsers = await service.getAllUsers(token[0])
        expect(retrievedUsers.statusCode).toBe(200)
        expect(retrievedUsers.body).toBeDefined()
        expect(retrievedUsers.body).not.toHaveLength(0)

        const banResponse = await service.banUser(retrievedUsers.body[1].id, token[0])
        expect(banResponse.statusCode).toBe(200)
        expect(banResponse.body).toBeDefined()
        expect(banResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const bannedUser = await service.viewBannedUser(retrievedUsers.body[1].id, token[0])
        expect(bannedUser.statusCode).toBe(200)
        expect(bannedUser.body).toBeDefined()
        expect(bannedUser.body).toEqual(
            expect.objectContaining({
                Banlist: expect.objectContaining({
                    description: expect.any(String)
                })
            })
        )

        const unbanResponse = await service.unBanUser(retrievedUsers.body[1].id, token[0])
        expect(unbanResponse.statusCode).toBe(200)
        expect(unbanResponse.body).toBeDefined()
        expect(unbanResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const unBannedUser = await service.viewBannedUser(retrievedUsers.body[1].id, token[0])
        expect(unBannedUser.statusCode).toBe(200)
        expect(unBannedUser.body).toBeDefined()
        expect(unBannedUser.body).toEqual(
            expect.objectContaining({
                Banlist: null
            })
        )
    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})
