const passport = require('passport')
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy({
    name: req.body.name,
    password: req.body.password,
}, (name, password, done) => {
    User.findOne({ where: { name } })
        .then(user => {
            const auth = bcrypt.compare(password, password)
            if (auth) {
                return done(null, user)
            } else {
                return done(null, false, { errors: { 'Email or password': 'Incorrect' } })
            }
        }).catch(done)
}))
