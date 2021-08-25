// no saved data after test
const service = require('../helpService')


describe("Get on /team/id/players, delete on /team/id/kick", () => {

    test('should extract users in team and kick user', async () => {
        const ApplyToTeam = await service.applyToJoinTeam()
        expect(ApplyToTeam.statusCode).toEqual(200)
        expect(ApplyToTeam.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(ApplyToTeam.body).toBeDefined()
        expect(ApplyToTeam.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        const checkJoinAsAdmin = await service.extractRequest()
        expect(checkJoinAsAdmin.statusCode).toBe(200)
        expect(checkJoinAsAdmin.body).toBeDefined()
        expect(checkJoinAsAdmin.body).toHaveLength(1)
        expect(checkJoinAsAdmin.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    userEmail: expect.any(String),
                    requestType: expect.stringMatching('join team 1')
                })
            ])
        )
        const acceptedJoin = await service.acceptRequest(checkJoinAsAdmin.body[0].id)
        expect(acceptedJoin.statusCode).toEqual(200)
        expect(acceptedJoin.body).toBeDefined()
        expect(acceptedJoin.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const players = await service.playersByTeam()
        expect(players.statusCode).toBe(200)
        expect(players.body).toBeDefined()
        expect(players.body).toBeInstanceOf(Array)

        const kickResponse = await service.kickUserFromTeam(players.body[0].id)
        expect(kickResponse.statusCode).toBe(200)
        expect(kickResponse.body).toBeDefined()
        expect(kickResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})

