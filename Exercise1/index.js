const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Router = require('./routes/index')
const port = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Connect mongoDB
mongoose.connect('mongodb://localhost:27017/tp9', {
  useNewUrlParser: true,
})

// To make sure your connection was successful
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function () {
  console.log('Connected successfully')
})

// Set the app to listen to port 3001.
app.use(Router)
app.listen(port, () => {
  console.log('Server is running at http://localhost:3001')
})
