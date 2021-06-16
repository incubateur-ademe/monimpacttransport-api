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
            transportation.footprint[0].gco2ePerKm
          : transportation.footprint[0].gco2ePerKm
      )

const getFootprint = (transportations, km, ignoreRadiativeForcing) =>
  transportations.map((transportation) => {
    const footprintObject = transportation.footprint.find(
      (footprintrow) =>
        !footprintrow.validity ||
        (footprintrow.validity[0] < km && footprintrow.validity[1] > km)
    )
    const footprint = {
      usage:
        footprintObject && footprintObject.gco2ePerKm
          ? footprintObject.gco2ePerKm * km
          : null,
      unit: 'gco2e',
    }
    if (
      footprintObject &&
      footprintObject.gco2ePerKmWithoutRadiativeForcing &&
      ignoreRadiativeForcing
    ) {
      footprint.usage = footprintObject.gco2ePerKmWithoutRadiativeForcing * km
    }
    return {
      ...transportation,
      footprint,
    }
  })

const filterFields = (transportations, fields) =>
  transportations.map((transportation) => {
    let response = {
      id: transportation.id,
      name: transportation.name.fr,
      footprint: transportation.footprint,
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
          : a.footprint.usage === null || a.footprint.usage > b.footprint.usage
          ? 1
          : -1
      )
module.exports = {
  filterTransportations,
  getFootprint,
  filterFields,
  sortTransportations,
}
