const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDb connected')
    })
    .catch(err => {
        console.log('Mongo err', err)
    })

module.exports = mongoose