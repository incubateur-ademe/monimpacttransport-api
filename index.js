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
  response.json({
    title: 'API Mon Impact Transport',
    description: "API alimentant l'app Mon Impact Transport",
    repo: 'https://github.com/datagir/monimpacttransport-api',
    documentation: 'https://github.com/datagir/monimpacttransport-api',
    versions: [
      {
        title: 'beta',
        endpoints: ['/beta/emissions', '/beta/transportations'],
      },
    ],
  })
})

app.get('/beta/transportations', db.getTransportations)
app.get('/beta/emissions', db.getEmissions)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
