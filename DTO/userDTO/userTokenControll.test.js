const { sign, signForReset, verifyForReset } = require('./userTokenControll')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6InZpY3RvcnIiLCJyb2xlSWQiOjEsImlhdCI6MTYyODg1OTM2MywiZXhwIjoxNjI4ODYwMjYzfQ.KU_T2r-YcAFHQRgdZqE3jY6GOjAibQNwFEo-CXOkGw0'

test('token create should return token string', () => {
    expect(sign({
        id: 1,
        name: 'username',
        roleId: 1
    })).toBeTruthy()
})

test('token sign should return token string', () => {
    expect(signForReset({
        id: 3,
        name: 'username',
        roleId: 1
    })).toBeTruthy()
})

test('token verification should return user object', () => {
    expect(verifyForReset(
        token
    )).toMatchObject({})
})


