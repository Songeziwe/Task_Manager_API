require('../src/db/mongoose') // connect to mongodb using mongoose
const Task = require('../src/models/task') // access the task model

// const id = '63eb8ecccb10e88104697c24'

// Task
// .findByIdAndRemove(id)
// .then(r => {
//   console.log(r)
//   return Task.countDocuments({ completed: false })
// })
// .then(r => console.log({ r }))
// .catch(e => console.log(e.message))

// Task
// .find({})
// .then(r => console.log(r))
// .catch(e => console.log(e))