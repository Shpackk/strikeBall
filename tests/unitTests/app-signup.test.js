const app = require('../../app')
const supertest = require('supertest')

function generateCreds() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt((Math.random() * n));
    }
    return retVal;
}

describe('Post on /signup', () => {
    test("should return registered user JSON object", async () => {
        const credentials = generateCreds()
        const response = await supertest(app)
            .post("/signup")
            .send({
                name: credentials,
                email: credentials + "@google.com",
                role: "user",
                password: credentials
            })
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                email: expect.any(String),
                name: expect.any(String),
                roleId: expect.any(Number),
                token: expect.any(String)
            })
        )
    })
})



describe('Checking conflicts on post /signup', () => {

    // when username field is blank , error message pops up
    test("should return error message that username field is blank", async () => {
        const response = await supertest(app).post('/signup').send({
            name: "",
            email: "blabla@gmail.com",
            role: "user",
            password: "mycoolpassword"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringContaining('Name should be in lowerCase and greater than 4')
            })
        )
    })
    // when role field is blank , error message pops up
    test("should return error message that role field is invalid", async () => {
        const response = await supertest(app).post('/signup').send({
            name: "coolbobby",
            email: "coolbobby@gmail.com",
            role: "",
            password: "coolbobby"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringContaining('Enter correct role')
            })
        )
    })
    test("should inform that user is already registered", async () => {
        const response = await supertest(app).post('/signup').send({
            name: "testfromjest",
            email: "testfromjest@google.com",
            role: "user",
            password: "testfromjest"
        })
        expect(response.statusCode).toBe(409)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.stringContaining('user is already registered')
            })
        )
    })
})