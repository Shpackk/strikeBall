const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const db = require('./config/database')

app.use(express.static('static'))
app.use(express.json())
app.use(require('./routes/routes'))

db.sync()
    .then(() => console.log('DB is synced!'))
    .catch(err => console.log(err))

// app listening 
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
    try {
        db.authenticate()
        console.log('DB is connected!')
    } catch (error) {
        console.log(error)
    }
})
