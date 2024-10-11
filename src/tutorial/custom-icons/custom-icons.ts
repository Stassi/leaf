import { type LatLngExpression, type Map } from 'leaflet'

import { map as leafletMap, marker, tileLayerOsm } from '@stassi/leaf'

type Icon = {
  iconUrl: string
  latitudeLongitude: LatLngExpression
  popupContent: string
}

const map: Map = leafletMap({
    center: [51.5, -0.09],
    id: 'map',
    zoom: 13,
  }),
  icons = <Icon[]>[
    {
      iconUrl: 'image/green.png',
      latitudeLongitude: [51.5, -0.09],
      popupContent: 'I am a green leaf.',
    },
    {
      iconUrl: 'image/orange.png',
      latitudeLongitude: [51.49, -0.1],
      popupContent: 'I am an orange leaf.',
    },
    {
      iconUrl: 'image/red.png',
      latitudeLongitude: [51.495, -0.083],
      popupContent: 'I am a red leaf.',
    },
  ]

tileLayerOsm({
  map,
})

icons.forEach(({ iconUrl, latitudeLongitude, popupContent }: Icon): void => {
  marker({
    iconOptions: {
      iconAnchor: [22, 94],
      iconSize: [38, 95],
      iconUrl,
      popupAnchor: [-3, -76],
      shadowAnchor: [4, 62],
      shadowSize: [50, 64],
      shadowUrl: 'image/shadow.png',
    },
    latitudeLongitude,
    map,
    popupContent,
  })
})
