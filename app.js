const express = require('express')
const app = express()
const passport = require('passport')
const PORT = process.env.PORT || 3000
const db = require('./config/database')
const userRoutes = require('./routes/UserRoutes')
const teamRoutes = require('./routes/TeamRoutes')
const errorHandler = require('./middleware/errorHandler')

app.use(passport.initialize());
app.use(express.static('static'))
app.use(express.json())
app.use(userRoutes)
app.use(teamRoutes)
app.use(errorHandler)


db.sync()
    .then(() => console.log('DB is synced!'))
    .catch(err => console.log(err))

// app listening 
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

