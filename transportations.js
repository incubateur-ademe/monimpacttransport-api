const structureTransportations = (rows) =>
  rows.reduce(
    (acc, cur) =>
      acc.find((row) => row.id === cur.id)
        ? [
            ...acc.map((row) =>
              row.id === cur.id
                ? {
                    ...row,
                    name: {
                      ...row.name,
                      [cur.labellanguage]: cur.labelvalue,
                    },
                    description: {
                      ...row.description,
                      [cur.descriptionlanguage]: cur.descriptionvalue,
                    },
                    emoji: {
                      ...row.emoji,
                      [cur.emojitype]: cur.emojivalue,
                    },
                    footprint:
                      !cur.validity ||
                      row.footprint.find(
                        (footprintrow) =>
                          JSON.stringify(footprintrow.validity) ===
                          JSON.stringify(cur.validity)
                      )
                        ? row.footprint
                        : [
                            ...row.footprint,
                            {
                              gco2ePerKm: cur.gco2e_per_km,
                              gco2ePerKmWithoutRadiativeForcing:
                                cur.gco2e_per_km_without_radiative_forcing,
                              validity: cur.validity,
                            },
                          ].sort(),
                  }
                : row
            ),
          ]
        : [
            ...acc,
            {
              id: cur.id,
              source: cur.source,
              name: { [cur.labellanguage]: cur.labelvalue },
              emoji: {
                [cur.emojitype]: cur.emojivalue,
              },
              description: {
                [cur.descriptionlanguage]: cur.descriptionvalue,
              },
              carpool: cur.carpool,
              footprint: [
                {
                  gco2ePerKm: cur.gco2e_per_km,
                  gco2ePerKmWithoutRadiativeForcing:
                    cur.gco2e_per_km_without_radiative_forcing,
                  validity: cur.validity,
                },
              ],
              display: {
                min: cur.display_min,
                max: cur.display_max,
                default: cur.display_default,
              },
            },
          ],
    []
  )

module.exports = {
  structureTransportations,
}
