const express = require('express')
const app = express()
const port = 5000

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`App running on port ${port}.`)
})
