const passport = require('passport')
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt
require('dotenv').config()

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromHeader('token'),
    secretOrKey: process.env.JWT_SECRET
}, (user, done) => {
    if (user) {
        return done(null, user)
    } else {
        const error = {
            "msg": "Bad token"
        }
        return done(error, false)
    }
}))
