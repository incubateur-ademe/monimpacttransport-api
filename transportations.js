const structureTransportations = (rows) =>
  rows.reduce(
    (acc, cur) =>
      acc.find((row) => row.id === cur.id)
        ? [
            ...acc.map((row) =>
              row.id === cur.id
                ? {
                    ...row,
                    name: setName(row, cur),
                    description: setDescription(row, cur),
                    emoji: setEmoji(row, cur),
                    footprint: setFootprint(row, cur),
                  }
                : row
            ),
          ]
        : [
            ...acc,
            {
              id: cur.id,
              source: cur.source,
              name: setName({}, cur),
              emoji: setEmoji({}, cur),
              description: setDescription({}, cur),
              carpool: cur.carpool,
              footprint: setFootprint({}, cur),
              display: {
                min: cur.display_min,
                max: cur.display_max,
                default: cur.display_default,
              },
            },
          ],
    []
  )

const setName = (acc, cur) => ({
  ...acc.name,
  [cur.labellanguage]: cur.labelvalue,
})
const setEmoji = (acc, cur) => ({
  ...acc.emoji,
  [cur.emojitype]: cur.emojivalue,
})
const setDescription = (acc, cur) => ({
  ...acc.description,
  [cur.descriptionlanguage]: cur.descriptionvalue,
})
const setFootprint = (acc, cur) =>
  acc.footprint
    ? !cur.validity ||
      acc.footprint.find(
        (footprintrow) =>
          JSON.stringify(footprintrow.validity) === JSON.stringify(cur.validity)
      )
      ? acc.footprint
      : [
          ...acc.footprint,
          {
            gco2ePerKm: cur.gco2e_per_km,
            gco2ePerKmWithoutRadiativeForcing:
              cur.gco2e_per_km_without_radiative_forcing,
            validity: cur.validity,
          },
        ].sort()
    : [
        {
          gco2ePerKm: cur.gco2e_per_km,
          gco2ePerKmWithoutRadiativeForcing:
            cur.gco2e_per_km_without_radiative_forcing,
          validity: cur.validity,
        },
      ]

module.exports = {
  structureTransportations,
}
