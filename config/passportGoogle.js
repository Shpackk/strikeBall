const passport = require('passport')
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbRequest = require('../DTO/userDTO/userDBrequests')

passport.use(new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"

}, async (accessToken, refreshToken, profile, done) => {
    const user = {
        googleId: profile._json.sub,
        name: profile._json.given_name,
        picture: profile._json.picture,
        email: profile._json.email
    }
    try {
        const retrievedUser = await dbRequest.createUserGoogle(user)
        if (retrievedUser) {
            return done(null, retrievedUser[0].dataValues)
        } else {
            return done(error, null)
        }

    } catch (error) {
        done(error, null)
    }
}
));