require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 4000
const app = express()
// const userRouter = require('./user')
const apolloServer = require('./apollo')

apolloServer.applyMiddleware({
  app
})
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.listen(port, error => {
  if (error) throw error
  console.log(`dejavu services is listening on port: http://localhost:${port}/graphql`)
})

app.get('*', (req, res) => {
  res.json('pong')
})
