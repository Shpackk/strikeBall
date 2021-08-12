// require('dotenv').config()
// const passport = require('passport')
// const FaceBookStrategy = require('passport-facebook').Strategy

// passport.use(new FaceBookStrategy({
//     clientID: process.env.CLIENT_FB_ID,
//     clientSecret: process.env.FB_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback",
//     profileFields: ['id', 'displayName', 'photos', 'email']
// },
//     function (accessToken, refreshToken, profile, done) {
//         console.log(profile)
//         console.log(refreshToken)
//         console.log(accessToken)
//         return done(null, profile)
//         // if (err) {
//         //     return done(err)
//         // }
//         // return done(null, profile)
//     }
// ));