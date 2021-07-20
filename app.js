const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const db = require('./config/database')
const User = require('./models/User')
app.use(express.static('static'))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('index')
})
//comment
app.post('/user/create', (req, res) => {
    const name = req.body.name
    const role = req.body.role
    User.create({
        name,
        role
    })
        .then(result => res.send(result))
        .catch(err => console.log(err))
})

app.delete('/user/delete', (req, res) => {
    const name = req.body.name
    User.destroy({
        where: {
            name
        }
    }).then(result => {
        res.json(result)
    }).catch(err => console.log(err))
})

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
