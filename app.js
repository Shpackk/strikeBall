const express = require('express')
const app = express()
//-------------
const server = require('http').createServer(app)
const io = require('socket.io')(server)
module.exports = io
//-------------
const passport = require('passport')
const db = require('./models/index')
const userRoutes = require('./routes/UserRoutes')
const teamRoutes = require('./routes/TeamRoutes')
const authRoutes = require('./routes/authRoutes')
const errorHandler = require('./middleware/errorHandler')
const nonExistingRoute = require('./middleware/nonExistingRoute')
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use('uploads/', express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.json())
app.use(userRoutes)
app.use(teamRoutes)
app.use(authRoutes)
app.use(errorHandler)
app.use(nonExistingRoute)

db.sequelize.sync()
    .then(() => console.log('PostgreSQL is synced!'))
    .catch(err => console.log(err))

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT);
}
module.exports = server



