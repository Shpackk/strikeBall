const check = require('../middleware/inputVerify')

describe('Input verify', () => {
    test('should return error message', () => {
        const user = {
            name: 'Johan'
        }
        expect(check.inputValidation(user)).toBeUndefined
    })
})