const app = require('../../app')
const supertest = require('supertest')
const service = require('../helpService')
const { Banlist } = require('../../models/index')
const data = require('../testUsersData')


beforeAll(async () => {
    const user = await service.createTestUsers()
    await Banlist.create({
        userId: user.dataValues.id,
        description: 'sorry',
        userEmail: user.dataValues.email
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
    ///;kjfhglskjdfhglskjfhglskjfdhglskfjdhgslkdfjh
    test("Should return users credentials when logging in", async () => {
        const response = await service.loginUser(data.testManager.name, data.testManager.password)
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                roleId: expect.any(Number),
                token: expect.any(String)
            })
        )
        expect(response.statusCode).toBe(201)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()

    })

    test("Should inform that user is banned from service", async () => {
        const response = await service.loginUser(data.testUser.name, data.testUser.password)
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(expect.any(Object))
    })

    afterAll(async () => {
        await service.testUserDelete(data.AnotherUser.name)
        await service.testUserDelete(data.testUserTwo.name)
        await service.testUserDelete(credentials)
        await service.testUserDelete(data.testManager.name)
        await Banlist.destroy({
            where: {
                userEmail: data.testUser.email
            }
        })
        await service.testUserDelete(data.testUser.name)
        service.closeConnection()
    })
})


