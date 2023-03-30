require('../src/db/mongoose')
const User = require('../src/models/user')

const id = '63eb86032d80f48311f5f450'

User
.findByIdAndUpdate(id, { age: 10 })
.then(user => {
  console.log(user)
  return User.countDocuments({ age: 10 })
})
.then(result => console.log({ result }))
.catch(error => console.log({ error }))
