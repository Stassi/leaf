import {
  circle,
  map as leafletMap,
  marker,
  polygon,
  popup,
  tileLayerOsm,
} from '../../../leaf/leaf.js'

// noinspection JSUnusedGlobalSymbols
const map = leafletMap({
  center: [51.505, -0.09],
  id: 'map',
  onClick: ({ latlng: latitudeLongitude }) => {
    popup({
      htmlContent: `You clicked the map at ${latitudeLongitude}`,
      latitudeLongitude,
      map,
    })
  },
  zoom: 13,
})

tileLayerOsm({
  map,
  zoomMax: 19,
})

marker({
  latitudeLongitude: [51.5, -0.09],
  map,
  popupContent: '<b>Hello world!</b><br>I am a popup.',
})

circle({
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  latitudeLongitude: [51.508, -0.11],
  map,
  popupContent: 'I am a circle.',
  radius: 500,
})

polygon({
  latitudeLongitudes: [
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
  ],
  map,
  popupContent: 'I am a polygon.',
})

popup({
  htmlContent: 'I am a standalone popup.',
  latitudeLongitude: [51.513, -0.09],
  map,
})
