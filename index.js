require('dotenv').config()

const express = require('express')

const app = express()
const db = require('./queries')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/beta/transportations', db.getTransportations)
app.get('/beta/distance', db.getFootprintByDistance)
app.get('/beta/distance/:km', db.getFootprintByDistance)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
