// no saved data after test
const service = require('../helpService')

beforeAll(async () => {
    const token = await service.loginForTests()
    return token
})
describe('End to end user join and leave team flow', () => {
    test('should sucessfully apply to team, and return created request', async () => {
        const ApplyToTeam = await service.applyToJoinTeam(token[1].token)
        expect(ApplyToTeam.statusCode).toEqual(200)
        expect(ApplyToTeam.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(ApplyToTeam.body).toBeDefined()
        expect(ApplyToTeam.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )
        const userRequest = await service.viewMyRequests(token[1])
        expect(userRequest.statusCode).toBe(200)
        expect(userRequest.body).toBeDefined()
        expect(userRequest.body).toHaveLength(1)
        expect(userRequest.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    requestType: expect.stringMatching('join')
                })
            ])
        )
    })
    test('admin should see new request, and sucessfully accept it', async () => {
        const checkJoinAsAdmin = await service.extractRequest(token[0])
        expect(checkJoinAsAdmin.statusCode).toBe(200)
        expect(checkJoinAsAdmin.body).toBeDefined()
        expect(checkJoinAsAdmin.body).toHaveLength(1)
        expect(checkJoinAsAdmin.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    userEmail: expect.any(String),
                    requestType: expect.stringMatching('join')
                })
            ])
        )
        const acceptedJoin = await service.acceptRequest(checkJoinAsAdmin.body[0].id, token[0])
        expect(acceptedJoin.statusCode).toEqual(200)
        expect(acceptedJoin.body).toBeDefined()
        expect(acceptedJoin.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
    })
    test('user should now see in profile data about his team', async () => {
        const profileWithTeam = await service.checkProfile(token[1])
        expect(profileWithTeam.statusCode).toBe(200)
        expect(profileWithTeam.body).toBeDefined()
        expect(profileWithTeam.body).toMatchObject({ Team: { id: 1, name: "A" } })
    })

    test('user should be able to create request and see it in user-requests page', async () => {
        const teamLeave = await service.applyToLeaveTeam(token[1])
        expect(teamLeave.statusCode).toBe(200)
        expect(teamLeave.body).toBeDefined()
        expect(teamLeave.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )
        const newUserReq = await service.viewMyRequests(token[1])
        expect(newUserReq.statusCode).toBe(200)
        expect(newUserReq.body).toBeDefined()
        expect(newUserReq.body).toHaveLength(1)
        expect(newUserReq.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    requestType: expect.stringMatching('leave')
                })
            ])
        )
    })
    test('admin should extract users request and accept it', async () => {
        const checkLeaveAsAdmin = await service.extractRequest(token[0])
        expect(checkLeaveAsAdmin.statusCode).toBe(200)
        expect(checkLeaveAsAdmin.body).toBeDefined()
        expect(checkLeaveAsAdmin.body).toHaveLength(1)
        expect(checkLeaveAsAdmin.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    userEmail: expect.any(String),
                    requestType: expect.stringMatching('leave')
                })
            ])
        )
        const acceptLeave = await service.acceptRequest(checkLeaveAsAdmin.body[0].id, token[0])
        expect(acceptLeave.statusCode).toEqual(200)
        expect(acceptLeave.body).toBeDefined()
        expect(acceptLeave.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
    })
    test('user should see that he is not in a team anymore', async () => {
        const profileWithoutTeam = await service.checkProfile(token[1])
        expect(profileWithoutTeam.statusCode).toBe(200)
        expect(profileWithoutTeam.body).toBeDefined()
        expect(profileWithoutTeam.body).toMatchObject({ Team: null })
    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})
