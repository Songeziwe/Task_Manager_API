const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

router.post('/task', async (req, res) => {
  const { description, completed } = req.body
  const task = new Task({ description, completed })
  try {
    await task.save()
    res.status(201).send(task)
  } catch(e) {
    res.status(400).send(e.message)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch(e) {
    res.status(500).send(e.message)
  }
})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findById(_id)
    if(!task)
      return res.status(404).send('Not Found')
    res.status(200).send(task)
  } catch(e) {
    res.status(500).send(e.message)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  const propertiesToUpdate = Object.keys(req.body)
  const taskProperties = ['description', 'completed']

  const isValidUpdate = propertiesToUpdate.every(property => taskProperties.includes(property))
  
  if(!isValidUpdate) return res.status(404).send('Invalid field(s) to update.')

  try {
    const task = await Task.findById(req.params.id)
    if(!task) return res.status(404).send('Task does not exist.')

    propertiesToUpdate.forEach(p => task[p] = req.body[p])
    await task.save()

    res.status(201).send(task)
  } catch(e) {
    res.status(400).send(e.message)
  }
})


router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const deletedTask = await Task.findByIdAndDelete(_id)
    if(!deletedTask) return res.status(404).send('Not Found')

    res.send(deletedTask)
  } catch(e) {
    res.status(500).send(e.message)
  }
})

module.exports = router