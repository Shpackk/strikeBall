const service = require('../helpService')

describe('Manager registration and checking if he is added to all managers', () => {
    const creds = service.generateCreds()

    test('should register manager and check if he is in a list', async () => {
        const managersPrev = await service.getManagers()
        expect(managersPrev.statusCode).toBe(200)
        expect(managersPrev.body).toBeDefined()
        expect(managersPrev.body).toBeInstanceOf(Array)

        const regResponse = await service.regManager(creds)
        expect(regResponse.statusCode).toBe(201)
        expect(regResponse.body).toBeDefined
        expect(regResponse.body).toEqual(
            expect.objectContaining({
                message: "You sucessfully applied!"
            })
        )

        const getReqAsAdmin = await service.extractRequest()
        expect(getReqAsAdmin.statusCode).toBe(200)
        expect(getReqAsAdmin.body).toBeDefined()
        expect(getReqAsAdmin.body).toBeInstanceOf(Array)

        const acceptResponse = await service.acceptRequest(getReqAsAdmin.body[0].id)
        expect(acceptResponse.statusCode).toBe(200)
        expect(acceptResponse.body).toBeDefined()
        expect(acceptResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String)
            })
        )

        const managersNew = await service.getManagers()
        expect(managersNew.statusCode).toBe(200)
        expect(managersNew.body).toBeDefined()
        expect(managersNew.body).toBeInstanceOf(Array)

        expect(managersNew.body > managersPrev.body).toBeTruthy()

    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        await service.testUserDelete(creds)

        service.closeConnection()
    })
})
