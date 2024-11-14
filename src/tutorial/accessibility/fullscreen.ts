import '../style/medium.css'
import '../style/theme.css'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import 'leaflet/dist/leaflet.css'

import { type Map } from '@stassi/leaf'

const altText = 'Kyiv',
  map: Map = await (
    await import('../../leaf/map/map.js')
  ).map({
    center: [50.4501, 30.5234],
    id: 'map',
    zoom: 4,
  })

await (
  await import('../../leaf/marker.js')
).marker({
  altText,
  iconOptions: {
    iconUrl: '../../../leaflet/images/marker-icon.png',
    iconUrlRetina: '../../../leaflet/images/marker-icon-2x.png',
    shadowUrl: '../../../leaflet/images/marker-shadow.png',
  },
  latitudeLongitude: [50.4501, 30.5234],
  map,
  popupContent: `${altText}, Ukraine is the birthplace of Leaflet!`,
})

await (
  await import('../../leaf/tile-layer/tile-layer-osm.js')
).tileLayerOsm({
  map,
  zoomMax: 19,
})
