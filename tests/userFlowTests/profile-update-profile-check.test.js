const service = require('../helpService')

describe('patch on /user/update', () => {

    test('should return updated profile after patching info', async () => {
        const creds = service.generateCreds()

        const updateResponse = await service.updateInfo(creds)
        expect(updateResponse).toBeDefined()
        expect(updateResponse.body[1][0]).toEqual(
            expect.objectContaining({
                name: expect.anything()
            })
        )

        const viewManager = await service.getManager()
        expect(viewManager.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.stringContaining(creds),
                email: expect.any(String)
            })
        )

    })
})

