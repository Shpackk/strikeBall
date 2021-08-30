// no saved data after test
const service = require('../helpService')

describe('End to end user join and leave team flow', () => {
    test('should sucessfully apply to team, and return created request', async () => {
        //1.apply to join team
        const ApplyToTeam = await service.applyToJoinTeam()
        expect(ApplyToTeam.statusCode).toEqual(200)
        expect(ApplyToTeam.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(ApplyToTeam.body).toBeDefined()
        expect(ApplyToTeam.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        //2.view request as user 
        const userRequest = await service.viewMyRequests()
        expect(userRequest.statusCode).toBe(200)
        expect(userRequest.body).toBeDefined()
        expect(userRequest.body).toHaveLength(1)
        expect(userRequest.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    requestType: expect.stringMatching('join team 1')
                })
            ])
        )
    })
    test('admin should see new request, and sucessfully accept it', async () => {
        //3.extract request as admin
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
        // 4.accept team join as admin
        const acceptedJoin = await service.acceptRequest(checkJoinAsAdmin.body[0].id)
        expect(acceptedJoin.statusCode).toEqual(200)
        expect(acceptedJoin.body).toBeDefined()
        expect(acceptedJoin.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
    })
    test('user should now see in profile data about his team', async () => {
        //5. view profile as user to confirm team join
        const profileWithTeam = await service.checkProfile()
        expect(profileWithTeam.statusCode).toBe(200)
        expect(profileWithTeam.body).toBeDefined()
        expect(profileWithTeam.body).toMatchObject({ Team: { id: 1, name: "A" } })
    })

    test('user should be able to create request and see it in user-requests page', async () => {
        // //6. request to leave team
        const teamLeave = await service.applyToLeaveTeam()
        expect(teamLeave.statusCode).toBe(200)
        expect(teamLeave.body).toBeDefined()
        expect(teamLeave.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        //7. view pending request as user
        const newUserReq = await service.viewMyRequests()
        expect(newUserReq.statusCode).toBe(200)
        expect(newUserReq.body).toBeDefined()
        expect(newUserReq.body).toHaveLength(1)
        expect(newUserReq.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    requestType: expect.stringMatching('leave team 1')
                })
            ])
        )
    })
    test('admin should extract users request and accept it', async () => {
        //8. extract requests as admin
        const checkLeaveAsAdmin = await service.extractRequest()
        expect(checkLeaveAsAdmin.statusCode).toBe(200)
        expect(checkLeaveAsAdmin.body).toBeDefined()
        expect(checkLeaveAsAdmin.body).toHaveLength(1)
        expect(checkLeaveAsAdmin.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    userEmail: expect.any(String),
                    requestType: expect.stringMatching('leave team 1')
                })
            ])
        )

        //9. accept request as admin
        const acceptLeave = await service.acceptRequest(checkLeaveAsAdmin.body[0].id)
        expect(acceptLeave.statusCode).toEqual(200)
        expect(acceptLeave.body).toBeDefined()
        expect(acceptLeave.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )
    })

    test('user should see that he is not in a team anymore', async () => {
        //10. check profile to confirm team leave
        const profileWithoutTeam = await service.checkProfile()
        expect(profileWithoutTeam.statusCode).toBe(200)
        expect(profileWithoutTeam.body).toBeDefined()
        expect(profileWithoutTeam.body).toMatchObject({ Team: null })
    })

    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})
