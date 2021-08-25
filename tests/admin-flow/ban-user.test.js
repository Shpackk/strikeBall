// no data saved after test
//1. view all users from '/users'
//2. select user and ban 
//3. search for this user in '/user/:id' and check 'banlist' field
//4. unban user
const service = require('../helpService')

describe('POST on /user/:id/ban', () => {

    test('get random user, ban, check if ban-field is not empty', async () => {
        const retrievedUsers = await service.getAllUsers()
        expect(retrievedUsers.statusCode).toBe(200)
        expect(retrievedUsers.body).toBeDefined()
        expect(retrievedUsers.body).not.toHaveLength(0)

        const banResponse = await service.banUser(retrievedUsers.body[1].id)
        expect(banResponse.statusCode).toBe(200)
        expect(banResponse.body).toBeDefined()
        expect(banResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const bannedUser = await service.viewBannedUser(retrievedUsers.body[1].id)
        expect(bannedUser.statusCode).toBe(200)
        expect(bannedUser.body).toBeDefined()
        expect(bannedUser.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String),
                name: expect.any(String),
                picture: expect.anything(),
                Team: null,
                Role: expect.objectContaining({
                    id: expect.any(Number),
                    role: expect.any(String)
                }),
                Banlist: expect.objectContaining({
                    description: expect.any(String)
                })
            })
        )

        const unbanResponse = await service.unBanUser(retrievedUsers.body[1].id)
        expect(unbanResponse.statusCode).toBe(200)
        expect(unbanResponse.body).toBeDefined()
        expect(unbanResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )


        const unBannedUser = await service.viewBannedUser(retrievedUsers.body[1].id)
        expect(unBannedUser.statusCode).toBe(200)
        expect(unBannedUser.body).toBeDefined()
        expect(unBannedUser.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String),
                name: expect.any(String),
                picture: expect.anything(),
                Team: null,
                Role: expect.objectContaining({
                    id: expect.any(Number),
                    role: expect.any(String)
                }),
                Banlist: null
            })
        )

    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})
