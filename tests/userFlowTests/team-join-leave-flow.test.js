const app = require('../../app')
const supertest = require('supertest')

const userToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsIm5hbWUiOiJ0ZXN0ZnJvbWplc3QiLCJyb2xlSWQiOjEsImlhdCI6MTYyOTM4MjIzMX0.D14g7Zx0xqP1PKWoTk8cbqEZNTZeHJTfg8Innr04JeM'
}

const adminToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwicm9sZUlkIjozLCJpYXQiOjE2MjkxOTczNDl9.nAMPtbEsxkrPBneuzqP4OpRfpk3O3QslnxrxT7owoQ8',
}
describe('End to end user join and leave team flow', () => {
    test('should work idk', async () => {
        //1.apply to join team
        const ApplyToTeam = await applyToJoinTeam()
        expect(ApplyToTeam.statusCode).toEqual(200)
        expect(ApplyToTeam.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(ApplyToTeam.body).toBeDefined()
        expect(ApplyToTeam.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        //2.view request as user 
        const userRequest = await viewPendingRequest()
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

        //3.extract request as admin
        const checkJoinAsAdmin = await extractRequests()
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

        //4.accept team join as admin
        const acceptedJoin = await acceptReq(checkJoinAsAdmin.body)
        expect(acceptedJoin.statusCode).toEqual(200)
        expect(acceptedJoin.body).toBeDefined()
        expect(acceptedJoin.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        //5. view profile as user to confirm team join
        const profileWithTeam = await viewProfile()
        expect(profileWithTeam.statusCode).toBe(200)
        expect(profileWithTeam.body).toBeDefined()
        expect(profileWithTeam.body).toMatchObject({ Team: { id: 1, name: "A" } })

        //6. request to leave team
        const teamLeave = await applyToLeaveTeam()
        expect(teamLeave.statusCode).toBe(200)
        expect(teamLeave.body).toBeDefined()
        expect(teamLeave.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        //7. view pending request as user
        const newUserReq = await viewPendingRequest()
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

        //8. extract requests as admin
        const checkLeaveAsAdmin = await extractRequests()
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
        const acceptLeave = await acceptReq(checkLeaveAsAdmin.body)
        expect(acceptLeave.statusCode).toEqual(200)
        expect(acceptLeave.body).toBeDefined()
        expect(acceptLeave.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        //10. check profile to confirm team leave
        const profileWithoutTeam = await viewProfile()
        expect(profileWithoutTeam.statusCode).toBe(200)
        expect(profileWithoutTeam.body).toBeDefined()
        expect(profileWithoutTeam.body).toMatchObject({ Team: null })
    })

})

//1.
async function applyToJoinTeam() {
    const response = await supertest(app)
        .patch('/team/1/join')
        .set(userToken)
    return response
}
//2.
async function viewPendingRequest() {
    const response = await supertest(app)
        .get('/user/requests')
        .set(userToken)
    return response
}
//3.
async function extractRequests() {
    const response = await supertest(app)
        .get('/requests')
        .set(adminToken)
    return response
}
//4.
async function acceptReq(request) {
    const response = await supertest(app)
        .patch(`/requests/${request[0].id}`)
        .set(adminToken)
        .send({
            approved: true
        })
    return response
}
//5.
async function viewProfile() {
    const response = await supertest(app)
        .get('/user/profile')
        .set(userToken)
    return response
}
//6.
async function applyToLeaveTeam() {
    const response = await supertest(app)
        .delete('/team/1/leave')
        .set(userToken)
    return response
}