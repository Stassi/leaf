import 'leaflet/dist/leaflet.css'
import '../style/theme.css'
import '../style/medium.css'

import { type LatLngExpression, type Map } from '@stassi/leaf'

const map: Map = await (
  await import('../../leaf/map/map.js')
).map({
  center: [51.5, -0.09],
  id: 'map',
  zoom: 13,
})

await (
  await import('../../leaf/tile-layer/tile-layer-osm.js')
).tileLayerOsm({
  map,
})

for (const { iconUrl, latitudeLongitude, popupContent } of <
  ({
    latitudeLongitude: LatLngExpression
  } & Record<'iconUrl' | 'popupContent', string>)[]
>[
  {
    iconUrl: '../custom-icons/image/green.png',
    latitudeLongitude: [51.5, -0.09],
    popupContent: 'I am a green leaf.',
  },
  {
    iconUrl: '../custom-icons/image/orange.png',
    latitudeLongitude: [51.49, -0.1],
    popupContent: 'I am an orange leaf.',
  },
  {
    iconUrl: '../custom-icons/image/red.png',
    latitudeLongitude: [51.495, -0.083],
    popupContent: 'I am a red leaf.',
  },
]) {
  await (
    await import('../../leaf/marker.js')
  ).marker({
    iconOptions: {
      iconAnchor: [22, 94],
      iconSize: [38, 95],
      iconUrl,
      iconUrlRetina: iconUrl,
      popupAnchor: [-3, -76],
      shadowAnchor: [4, 62],
      shadowSize: [50, 64],
      shadowUrl: '../custom-icons/image/shadow.png',
    },
    latitudeLongitude,
    map,
    popupContent,
  })
}
