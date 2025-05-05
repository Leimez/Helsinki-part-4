const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const router = express.Router()

router.get('/', async (request, response) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    response.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

router.post('/', async (request, response) => {
  try {
    const { username, name, password } = request.body

    if (!username || !name || !password) {
      return response.status(400).json({
        error: 'username, name and password are required'
      })
    }

    if (password.length < 3) {
      return response.status(400).json({
        error: 'password must be at least 3 characters long'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    console.error('Error creating user:', error)
    response.status(400).json({
      error: 'Bad request',
      details: error.message
    })
  }
})

module.exports = router
