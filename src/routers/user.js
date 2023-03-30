const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

// user signup
router.post('/users', async (req, res) => {
  const { name, age, password, email } = req.body
  const user = new User({ name, password, email, age })
  try {
    const token = await user.generateAuthToken()  // generate token and then save user to the database with the token
    res.status(201).send({ user, token })
  } catch(e) {
    res.status(400).send(e.message)
  }
})

// user login
router.post('/users/login', async (req, res) => { 
  const { email, password } = req.body
  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()

    res.status(200).send({ user, token })
  } catch(e) {
    res.status(400).send(e.message)
  }
})

// logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    
    res.send({ logout: true })
  } catch(e) {
    res.status(500).send({ logout: false, error: e.message })
  }
})

// logout from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    const { user } = req
    user.tokens = []
    await user.save()
    
    res.send({ loggedOutAll: true })
  } catch(e) {
    res.status(500).send({ loggedOutAll: false, error: e.message })
  }
})

// user profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id
  const propertiesToUpdate = Object.keys(req.body)
  const userProperties = ['name', 'email', 'age', 'password']

  const isValidUpdate = propertiesToUpdate.every(property => userProperties.includes(property))
  
  if(!isValidUpdate)
    return res.status(400).send('Invalid field(s) to update.')

  try {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send('Invalid user id')

    propertiesToUpdate.forEach(property => user[property] = req.body[property])
    await user.save()

    res.status(201).send(user)
  } catch(e) {
    res.status(500).send(e.message)
  }
})

// user must be authenticated(logged in) first in order to delete user profile
// this is handled by the auth middleware
// by verifying the authentication.
router.delete('/users/me', auth, async (req, res) => {
  try {
    const { user } = req
    await user.remove()

    res.status(200).send(user)
  } catch(e) {
    res.status(500).send(e.message)
  }
})

module.exports = router
