// no saved data after test
const service = require('../helpService')

describe("Get on /team/id/players, delete on /team/id/kick", () => {
    test('should extract users in team and kick user', async () => {

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
})

