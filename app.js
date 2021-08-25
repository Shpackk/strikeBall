const express = require('express')
const app = express()
const passport = require('passport')
const db = require('./models/index')
const userRoutes = require('./routes/UserRoutes')
const teamRoutes = require('./routes/TeamRoutes')
const authRoutes = require('./routes/authRoutes')
const errorHandler = require('./middleware/errorHandler')
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
app.get('*', function (req, res) {
    res.status(404).json({ "message": "Page Not Found" })
});

db.sequelize.sync()
    .then(() => console.log('DB is synced!'))
    .catch(err => console.log(err))

// app listening 
// app.listen(PORT)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT);
}
module.exports = app
