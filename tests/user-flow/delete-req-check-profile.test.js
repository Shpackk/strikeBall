// no saved data after test
const service = require('../helpService')

describe('user requests manipulate', () => {

    test('should return sucess if request created, extracted and deleted', async () => {
        const createReqResponse = await service.createRequest()
        expect(createReqResponse.statusCode).toEqual(200)
        expect(createReqResponse.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(createReqResponse.body).toBeDefined()
        expect(createReqResponse.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        const getMyRequest = await service.viewMyRequests()
        expect(getMyRequest.statusCode).toBe(200)
        expect(getMyRequest.body).toBeDefined()
        expect(getMyRequest.body).toHaveLength(1)
        expect(getMyRequest.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    requestType: expect.stringMatching('join team 1')
                })
            ])
        )

        const delReqResponse = await service.deleteRequest(getMyRequest.body[0].id)
        expect(delReqResponse.statusCode).toBe(200)
        expect(delReqResponse.body).toBeDefined()
        expect(delReqResponse.body).toEqual(
            expect.objectContaining({
                message: "Request is sucessfully deleted"
            })
        )
    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        service.closeConnection()
    })
})
