const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

// attach a middleware to the schema
taskSchema.pre('save', function (next) {
  const task = this

  console.log('task updated...')

  next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task