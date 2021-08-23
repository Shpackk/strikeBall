const app = require('../../app')
const supertest = require('supertest')

const userToken = {
    'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsIm5hbWUiOiJ0ZXN0ZnJvbWplc3QiLCJyb2xlSWQiOjEsImlhdCI6MTYyOTM4MjIzMX0.D14g7Zx0xqP1PKWoTk8cbqEZNTZeHJTfg8Innr04JeM'
}

describe('user requests manipulate', () => {

    test('should return sucess if request created, extracted and deleted', async () => {
        const createReqResponse = await createRequest()
        expect(createReqResponse.statusCode).toEqual(200)
        expect(createReqResponse.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(createReqResponse.body).toBeDefined()
        expect(createReqResponse.body).toEqual(
            expect.objectContaining({
                message: expect.stringMatching('Sucessfully applied!')
            })
        )

        const getMyRequest = await viewMyRequests()
        expect(getMyRequest.statusCode).toBe(200)
        expect(getMyRequest.body).toBeDefined()
        expect(getMyRequest.body).toHaveLength(1)
        expect(getMyRequest.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    status: expect.stringMatching('active'),
                    requestType: expect.stringMatching('join team 2')
                })
            ])
        )

        const delReqResponse = await deleteRequest(getMyRequest.body[0].id)
        expect(delReqResponse.statusCode).toBe(200)
        expect(delReqResponse.body).toBeDefined()
        expect(delReqResponse.body).toEqual(
            expect.objectContaining({
                message: "Request is sucessfully deleted"
            })
        )
    })
})

async function createRequest() {
    const response = await supertest(app)
        .patch('/team/2/join')
        .set(userToken)
    return response
}

async function viewMyRequests() {
    const response = await supertest(app)
        .get('/user/requests')
        .set(userToken)
    return response
}

async function deleteRequest(id) {
    const response = await supertest(app)
        .delete(`/user/requests/delete/${id}`)
        .set(userToken)
    return response
}
