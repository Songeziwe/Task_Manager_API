const mongoose = require('mongoose')

const dbName = 'task-manager-api'
const connectionURL = 'mongodb://127.0.0.1:27017/'+ dbName

mongoose.set('strictQuery', false)

mongoose.connect(connectionURL)

module.exports = mongoose