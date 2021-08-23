//1. view all users from '/users'
//2. select user and ban 
//3. search for this user in '/user/:id' and check 'banlist' field
//4. unban user

const app = require('../../app')
const supertest = require('supertest')

const adminToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwicm9sZUlkIjozLCJpYXQiOjE2Mjg3NzIxNDV9.SlgSeMDZ2mka85mND12MHaXhRlZCUW4ZMRXF4FPH9FM',
}

describe('POST on /user/:id/ban', () => {

    test('get random user, ban, check if ban-field is not empty', async () => {
        const retrievedUsers = await getAllUsers()
        expect(retrievedUsers.statusCode).toBe(200)
        expect(retrievedUsers.body).toBeDefined()
        expect(retrievedUsers.body).not.toHaveLength(0)


        const banResponse = await banUser(retrievedUsers.body[1].id)
        expect(banResponse.statusCode).toBe(202)
        expect(banResponse.body).toBeDefined()
        expect(banResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const bannedUser = await viewBannedUser(retrievedUsers.body[1].id)
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

        const unbanResponse = await unBanUser(retrievedUsers.body[1].id)
        expect(unbanResponse.statusCode).toBe(202)
        expect(unbanResponse.body).toBeDefined()
        expect(unbanResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )


        const unBannedUser = await viewBannedUser(retrievedUsers.body[1].id)
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
})
//1.
async function getAllUsers() {
    const users = await supertest(app)
        .get('/users')
        .set(adminToken)
    return users
}

//2.
async function banUser(id) {
    const bannedUser = await supertest(app)
        .post(`/user/${id}/ban`)
        .set(adminToken)
        .send({
            description: 'badhuman',
            type: 'ban'
        })
    return bannedUser
}
//3.
async function viewBannedUser(id) {
    const bannedUser = await supertest(app)
        .get(`/user/${id}`)
        .set(adminToken)
    return bannedUser
}

//4.
async function unBanUser(id) {
    const unbannedUser = await supertest(app)
        .post(`/user/${id}/ban`)
        .set(adminToken)
        .send({
            description: 'missclick',
            type: 'unban'
        })
    return unbannedUser
}