const express = require('express')
const cors = require('cors')
const userApi = require('./api/user')
const testApi = require('./api/test')
const mongoose = require('mongoose')
require('dotenv').config()
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const app = express()
app.use(express.json())
app.use(cors())

require('./config/config-passport')

app.use('/user', userApi)
app.use('/test', testApi)

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: `Use api on routes: 
    /api/registration - registration user {username, email, password}
    /api/login - login {email, password}
    /api/list - get message if user is authenticated`,
    data: 'Not found',
  })
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, function () {
  console.log(`Server running. Use our API on port: ${PORT}`)
})