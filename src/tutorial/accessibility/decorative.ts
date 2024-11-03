import 'leaflet/dist/leaflet.css'
import '../style/theme.css'
import '../style/medium.css'

import { type Map } from '@stassi/leaf'

document.getElementById('map')?.setAttribute('inert', '')

const map: Map = await (
  await import('../../leaf/map/map.js')
).map({
  center: [50.4501, 30.5234],
  id: 'map',
  zoom: 4,
})

await (
  await import('../../leaf/marker.js')
).marker({
  latitudeLongitude: [50.4501, 30.5234],
  map,
})

await (
  await import('../../leaf/tile-layer/tile-layer-osm.js')
).tileLayerOsm({
  map,
})
