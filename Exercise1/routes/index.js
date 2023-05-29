const express = require('express')
const userModel = require('../model/user')
const app = express()

app.get('/', function(request, response) {
  console.log("router up");
  res.send("Hello, this is API");
});

app.post('/register', async function(request, response) {
  const user = new userModel(request.body)

  try {
    await user.save()
    response.json({ success: true, data: user })
  } catch (error) {
    if (error.code == 11000) {
      msg = {
        success: false,
        error: 'User is already registered!',
      }
      response.status(400).json(msg)
    } else {
      response.status(500).send(error)
    }
  }
})

app.post('/login', async function(request, response) {
  const { email, password } = request.body

  try {
    const user = await userModel.findOne({ email, password })
    if (user == null) {
      msg = {
        message: 'Login failed',
        success: false,
        error: "The information you've entered is incorrect!",
      }
      response.status(400).send(msg)
    } else {
      console.log(user)
      response.send({ message: 'Login successful', success: true, data: user })
    }
  } catch (error) {
    response.status(500).send(error)
  }
})

app.get('/users', async function(request, response) {
  const users = await userModel.find({})

  try {
    response.send(users)
  } catch (error) {
    response.status(500).send(error)
  }
})

app.get('/', function(request, response) {
  response.send('Server is running at port 3001')
})

module.exports = app
