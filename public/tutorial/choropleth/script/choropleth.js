// noinspection JSUnresolvedReference, JSUnusedGlobalSymbols

import DOMPurify from '../../../dompurify/purify.es.mjs'
import { DomUtility } from '../../../leaflet-adapter/document-object-model/dom-utility.js'
import { control } from '../../../leaflet-adapter/control/control.js'
import { geoJson as leafletGeoJson } from '../../../leaflet-adapter/geo-json.js'
import { map as leafletMap } from '../../../leaflet-adapter/map/map.js'
import { tileLayer } from '../../../leaflet-adapter/tile-layer/tile-layer.js'
import { attributionOsm, urlTemplateOsm } from '../../../script/base-layers.js'
import data from '../data/us-state-population-density.json' with { type: 'json' }

const map = leafletMap({
    center: [37.8, -96],
    id: 'map',
    zoom: 4,
  }),
  grades = [0, 10, 20, 50, 100, 200, 500, 1000]

tileLayer({
  attribution: attributionOsm,
  map,
  urlTemplate: urlTemplateOsm,
  zoomMax: 19,
})

function getColor(density) {
  if (density > grades[7]) return '#800026'
  else if (density > grades[6]) return '#BD0026'
  else if (density > grades[5]) return '#E31A1C'
  else if (density > grades[4]) return '#FC4E2A'
  else if (density > grades[3]) return '#FD8D3C'
  else if (density > grades[2]) return '#FEB24C'
  else if (density > grades[1]) return '#FED976'
  return '#FFEDA0'
}

control({
  map,
  onAdd(_map) {
    const div = DomUtility.create('div', 'info legend')

    /* eslint-disable-next-line no-unsanitized/property --
       false positive if value wrapped in DOMPurify.sanitize(...) */
    div.innerHTML = DOMPurify.sanitize(
      grades
        .map((grade, i) => {
          const nextGrade = grades[i + 1],
            color = getColor(grade + 1),
            range = nextGrade ? `${grade}&ndash;${nextGrade}<br>` : `${grade}+`
          return `<i style="background:${color}"></i> ${range}`
        })
        .join(''),
    )

    return div
  },
  position: 'bottomright',
})

const info = control({
    map,
    onAdd(_map) {
      this._div = DomUtility.create('div', 'info')

      this.update()

      return this._div
    },
    update({ density, name } = {}) {
      /* eslint-disable-next-line no-unsanitized/property --
         false positive if value wrapped in DOMPurify.sanitize(...) */
      this._div.innerHTML = DOMPurify.sanitize(
        `<h4>US population density</h4>${
          density && name
            ? `<b>${name}</b><br />${density} people / mi<sup>2</sup>`
            : 'Hover over a state'
        }`,
      )
    },
  }),
  geoJson = leafletGeoJson({
    data,
    map,
    onEachFeature(_feature, layer) {
      layer.on({
        click({ target }) {
          map.fitBounds(target.getBounds())
        },
        mouseout({ target }) {
          info.update()

          geoJson.resetStyle(target)
        },
        mouseover({
          target: layer,
          target: {
            feature: { properties },
          },
        }) {
          info.update(properties)

          layer.setStyle({
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7,
            weight: 5,
          })

          layer.bringToFront()
        },
      })
    },
    style({ properties: { density } }) {
      return {
        color: 'white',
        dashArray: '3',
        fillColor: getColor(density),
        fillOpacity: 0.7,
        opacity: 1,
        weight: 2,
      }
    },
  })
