const { Banlist } = require('../../models/index')
const service = require('../helpService')

const testManager = {
    email: 'onemore@gmail.com',
    name: 'onemore',
    RoleId: 2,
    password: '$2b$10$3j2skdg8UdkUZkYbX0nc1.Ly4TEfCR09AMyqcjyDxv/yMHA532BXi',
    picture: null
}

const testUser = {
    email: 'bannedusertest@gmail.com',
    name: 'bannedusertest',
    RoleId: 1,
    password: '$2b$10$rsxDH5hOiEctsAYhNGSUXuSpIJzCNpvBlXd5sy6tspVTJpYnuLsvy',
    picture: null
}

describe('POST on /login', () => {
    beforeAll(async () => {
        await service.createTestUsers(testManager)
        const user = await service.createTestUsers(testUser)

        await Banlist.create({
            userId: user.dataValues.id,
            description: 'sorry',
            userEmail: user.dataValues.email
        })
    })

    test("Should return users credentials when logging in ", async () => {
        const response = await service.loginUser(testManager.name, 'manager')
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
        const response = await service.loginUser(testUser.name, 'bannedusertest')
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        expect(response.body).toBeDefined()
        expect(response.body).toEqual(expect.any(Object))
    })
    afterAll(async () => {
        await service.testUserDelete('fortestpurpose')
        await service.testUserDelete('onemore')

        await Banlist.destroy({
            where: {
                userEmail: 'bannedusertest@gmail.com'
            }
        })

        await service.testUserDelete('bannedusertest')
        service.closeConnection()
    })
})