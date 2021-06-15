const { Client } = require('pg')
const { structureTransportations } = require('./transportations')
const {
  filterTransportations,
  getFootprint,
  filterFields,
  sortTransportations,
} = require('./distance')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

client.connect()

const transportationsQuery = (transportations) => `SELECT 
    transportations.id, transportations.source, transportations.carpool, 
    transportations.display_min, transportations.display_max, transportations.display_default,
    labels.language as labellanguage, labels.value as labelvalue,
    descriptions.language as descriptionlanguage, descriptions.value as descriptionvalue,
    footprints.gco2e_per_km_without_radiative_forcing, footprints.gco2e_per_km, footprints.validity,
    emojis.type as emojitype, emojis.value as emojivalue
    FROM transportations
    LEFT JOIN labels ON transportations.id = labels.transportation
    LEFT JOIN descriptions ON transportations.id = descriptions.transportation
    LEFT JOIN footprints ON transportations.id = footprints.transportation
    LEFT JOIN emojis ON transportations.id = emojis.transportation
    ${
      transportations.length
        ? 'WHERE ' +
          transportations
            .map(
              (transportation, index) =>
                (index !== 0 ? ' OR' : '') +
                ' transportations.id = ' +
                transportation
            )
            .join(' ')
        : ''
    }
    ORDER BY transportations.id
  `
const getTransportations = (request, response) => {
  const transportations = (request.query.transportations || '')
    .split(',')
    .filter((transportation) => transportation)

  client.query(transportationsQuery(transportations), (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(structureTransportations(results.rows))
  })
}

const getFootprintByDistance = (request, response) => {
  const km = parseInt(request.params.km) || 1

  const filter = request.query.filter
  const ignoreRadiativeForcing = request.query.ignoreRadiativeForcing

  const sort = request.query.sort

  const fields = (request.query.fields || '')
    .split(',')
    .filter((field) => field)

  const transportations = (request.query.transportations || '')
    .split(',')
    .filter((transportation) => transportation)

  client.query(transportationsQuery(transportations), (error, results) => {
    if (error) {
      throw error
    }
    const rows = sortTransportations(
      filterFields(
        getFootprint(
          filterTransportations(
            structureTransportations(results.rows),
            km,
            filter
          ),
          km,
          ignoreRadiativeForcing
        ),
        fields
      ),
      sort
    )

    response.status(200).json(rows)
  })
}

module.exports = {
  getTransportations,
  getFootprintByDistance,
}
