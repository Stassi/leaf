import 'leaflet/dist/leaflet.css'
import '../style/theme.css'
import './style/short.css'

import { type LeafletMouseEvent } from 'leaflet'

import { type Map } from '@stassi/leaf'

const map: Map = await (
  await import('../../leaf/map/map.js')
).map({
  center: [51.505, -0.09],
  id: 'map',
  async onClick({
    latlng: latitudeLongitude,
  }: LeafletMouseEvent): Promise<void> {
    await (
      await import('../../leaf/popup.js')
    ).popup({
      htmlContent: `You clicked the map at ${latitudeLongitude.toString()}`,
      latitudeLongitude,
      map,
    })
  },
  zoom: 13,
})

await (
  await import('../../leaf/tile-layer/tile-layer-osm.js')
).tileLayerOsm({
  map,
  zoomMax: 19,
})

await (
  await import('../../leaf/marker.js')
).marker({
  iconOptions: {
    iconUrl: './assets/marker-icon.png',
  },
  latitudeLongitude: [51.5, -0.09],
  map,
  popupContent: '<b>Hello world!</b><br>I am a popup.',
})

await (
  await import('../../leaf/circle.js')
).circle({
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  latitudeLongitude: [51.508, -0.11],
  map,
  popupContent: 'I am a circle.',
  radius: 500,
})

await (
  await import('../../leaf/polygon.js')
).polygon({
  latitudeLongitudes: [
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
  ],
  map,
  popupContent: 'I am a polygon.',
})

await (
  await import('../../leaf/popup.js')
).popup({
  htmlContent: 'I am a standalone popup.',
  latitudeLongitude: [51.513, -0.09],
  map,
})
