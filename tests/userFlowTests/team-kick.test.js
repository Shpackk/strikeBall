const app = require('../../app')
const supertest = require('supertest')

const adminToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwicm9sZUlkIjozLCJpYXQiOjE2Mjk2NzgyMTF9.94oitAUmfxU9xfRBNI8ZtrrFsCfCWh819thxMSDQ03w',
}

describe("Get on /team/id/players, delete on /team/id/kick", () => {
    test('should extract users in team and kick user', async () => {

        const players = await playersByTeam()
        expect(players.statusCode).toBe(200)
        expect(players.body).toBeDefined()
        expect(players.body).toBeInstanceOf(Array)

        const kickResponse = await kickUserFromTeam(players.body[0].id)
        expect(kickResponse.statusCode).toBe(200)
        expect(kickResponse.body).toBeDefined()
        expect(kickResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
    })
})

async function playersByTeam() {
    const users = await supertest(app)
        .get('/team/2/players')
        .set(adminToken)
    return users
}

async function kickUserFromTeam(id) {
    const kick = await supertest(app)
        .delete('/team/2/kick')
        .set(adminToken)
        .send({
            userId: id,
            kickReason: 'innactivity'
        })
    return kick
}