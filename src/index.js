const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

require('./db/mongoose')  // connect to mongodb database using mongoose

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => console.log(`Server is listening on  port ${port}`))

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
  // const task = await Task.findById('642596c00cc1362a583c3554')
  // await task.populate('owner')
  // console.log(task.owner)

  const user = await User.findById('64259a8ec69c8f5579c83f1b')
  // console.log(user)
  await user.populate('tasks')
  console.log(user.tasks)
}

// main()