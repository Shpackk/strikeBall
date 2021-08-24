const app = require('../../app')
const supertest = require('supertest')
const { User, Banlist } = require('../../models/index')
const service = require('../helpService')

describe('POST on /login', () => {
    beforeAll(async () => {
        await User.create({
            email: 'onemore@gmail.com',
            name: 'onemore',
            RoleId: 2,
            password: '$2b$10$3j2skdg8UdkUZkYbX0nc1.Ly4TEfCR09AMyqcjyDxv/yMHA532BXi',
            picture: null
        })
        const user = await User.create({
            email: 'bannedusertest@gmail.com',
            name: 'bannedusertest',
            RoleId: 1,
            password: '$2b$10$rsxDH5hOiEctsAYhNGSUXuSpIJzCNpvBlXd5sy6tspVTJpYnuLsvy',
            picture: null
        })

        await Banlist.create({
            userId: user.dataValues.id,
            description: 'sorry',
            userEmail: user.dataValues.email
        })
    })

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
    afterAll(async () => {
        await Banlist.destroy({
            where: {
                userEmail: 'bannedusertest@gmail.com'
            }
        })
        await User.destroy({
            where: {
                email: 'onemore@gmail.com'
            }
        })

        await User.destroy({
            where: {
                email: 'bannedusertest@gmail.com'
            }
        })
        service.closeConnection()
    })
})