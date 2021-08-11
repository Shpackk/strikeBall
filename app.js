const express = require('express')
const app = express()
const passport = require('passport')
const PORT = process.env.PORT || 3000
const db = require('./models/index')
const userRoutes = require('./routes/UserRoutes')
const teamRoutes = require('./routes/TeamRoutes')
const authRoutes = require('./routes/authRoutes')
const errorHandler = require('./middleware/errorHandler')
const path = require('path')
// const { storageConfig, fileFilter } = require('./service/multer')
require('dotenv').config()


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
// app.use(express.static('static'))
app.use('uploads/', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(userRoutes)
app.use(teamRoutes)
app.use(authRoutes)
app.use(errorHandler)
// app.use(multer({ storage: storageConfig, fileFilter }).single("filedata"));


db.sequelize.sync()
    .then(() => console.log('DB is synced!'))
    .catch(err => console.log(err))

// app listening 
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

