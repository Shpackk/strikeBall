// flow of
// 1. registration
// 2. request to join team
// 3. accept by admin
// 4. view profile to check if team is correctly displayed
const service = require('../helpService')

describe('flow of registration, join team, accept, viewing team field in profile', () => {

    test('should sucess', async () => {
        const credentials = await service.registerUser()
        expect(credentials.statusCode).toBe(200)
        expect(credentials.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(credentials.body).toBeDefined()
        expect(credentials.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String),
                name: expect.any(String),
                roleId: expect.any(Number),
                token: expect.any(String)
            })
        )

        const ApplyToTeam = await service.applyToJoinTeam(credentials.body.token)
        expect(ApplyToTeam.statusCode).toEqual(200)
        expect(ApplyToTeam.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(ApplyToTeam.body).toBeDefined()
        expect(ApplyToTeam.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        const request = await service.extractRequest()
        expect(request).toBeDefined()

        const acceptedRequest = await service.acceptTeamJoin(request)
        expect(acceptedRequest.statusCode).toEqual(200)
        expect(acceptedRequest.body).toBeDefined()
        expect(acceptedRequest.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const checkProfile = await service.checkProfile({ 'token': credentials.body.token })
        expect(checkProfile.statusCode).toBe(200)
        expect(checkProfile.body).toBeDefined()
        expect(checkProfile.body).toMatchObject({ Team: { id: 1, name: "A" } })
    })
})

