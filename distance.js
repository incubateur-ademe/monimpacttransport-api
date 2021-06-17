const filterTransportations = (transportations, km, filter) =>
  filter === 'all'
    ? transportations
    : transportations.filter((transportation) =>
        filter === 'smart'
          ? //Not set
            ((!transportation.display.min && !transportation.display.max) ||
              //Only max
              (!transportation.display.min &&
                transportation.display.max >= km) ||
              //Only min
              (!transportation.display.max &&
                transportation.display.min <= km) ||
              //Both min and max
              (transportation.display.min <= km &&
                transportation.display.max >= km)) &&
            transportation.emissions[0].gco2ePerKm
          : transportation.emissions[0].gco2ePerKm
      )

const getEmissionsForDistance = (transportations, km, ignoreRadiativeForcing) =>
  transportations.map((transportation) => {
    const emissionsObject = transportation.emissions.find(
      (emissionsrow) =>
        !emissionsrow.validity ||
        (emissionsrow.validity[0] < km && emissionsrow.validity[1] > km)
    )
    const emissions = {
      usage:
        emissionsObject && emissionsObject.gco2ePerKm
          ? emissionsObject.gco2ePerKm * km
          : null,
      unit: 'gco2e',
    }
    if (
      emissionsObject &&
      emissionsObject.gco2ePerKmWithoutRadiativeForcing &&
      ignoreRadiativeForcing
    ) {
      emissions.usage = emissionsObject.gco2ePerKmWithoutRadiativeForcing * km
    }
    return {
      ...transportation,
      emissions,
    }
  })

const filterFields = (transportations, fields) =>
  transportations.map((transportation) => {
    let response = {
      id: transportation.id,
      name: transportation.name.fr,
      emissions: transportation.emissions,
    }
    for (let field of fields) {
      response[field] =
        (transportation[field] && transportation[field].fr) ||
        transportation[field]
    }
    return response
  })

const sortTransportations = (transportations, sort) =>
  sort === 'id'
    ? transportations
    : transportations.sort((a, b) =>
        sort === 'name'
          ? a.name.fr > b.name.fr
            ? 1
            : -1
          : a.emissions.usage === null || a.emissions.usage > b.emissions.usage
          ? 1
          : -1
      )
module.exports = {
  filterTransportations,
  getEmissionsForDistance,
  filterFields,
  sortTransportations,
}
