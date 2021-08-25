const app = require('../../app')
const supertest = require('supertest')
const service = require('../helpService')
const { User } = require('../../models/index')


beforeAll(async () => {
    await User.create({
        name: "testfromjest",
        email: "testfromjest@google.com",
        role: "user",
        password: '$2b$10$3j2skdg8UdkUZkYbX0nc1.Ly4TEfCR09AMyqcjyDxv/yMHA532BXi',
        picture: null
    })
})

describe('Post on /signup', () => {
    const credentials = service.generateCreds()
    test("should return registered user JSON object", async () => {
        const response = await service.registerUser(credentials)
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
    test("should return error message that username field is blank", async () => {
        const response = await supertest(app)
            .post('/signup')
            .send({
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

    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        await service.testUserDelete('testfromjest')
        await service.testUserDelete(credentials)
        service.closeConnection()
    })
})


