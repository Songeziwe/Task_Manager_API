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