const app = require('../../app')
const supertest = require('supertest')



describe('POST on /login', () => {

    //----------------
    test("Should return users credentials when logging in ", async () => {
        const response = await supertest(app)
            .post("/login")
            .send({
                name: "onemore",
                password: "manager"
            })
        expect(response.statusCode).toBeCloseTo(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                roleId: expect.any(Number),
                token: expect.any(String)
            })
        )
    })

    test("Should inform that user is banned from service", async () => {
        const response = await supertest(app)
            .post("/login")
            .send({
                name: "bannedusertest",
                password: "bannedusertest"
            })
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(expect.any(Object))
    })
})