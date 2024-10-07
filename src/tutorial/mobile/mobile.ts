import { type ErrorEvent, type LocationEvent, type Map } from 'leaflet'

import { circle, marker, tileLayerOsm, worldLocator } from '@stassi/leaf'

const map: Map = worldLocator({
  id: 'map',
  onLocate: ({
    accuracy: radius,
    latlng: latitudeLongitude,
  }: LocationEvent) => {
    circle({
      latitudeLongitude,
      map,
      radius,
    })

    marker({
      latitudeLongitude,
      map,
      popupContent: `You are within ${radius.toString()} meters from this point.`,
    }).openPopup()
  },
  onLocateError: ({ message }: ErrorEvent) => {
    // eslint-disable-next-line no-alert -- required by tutorial
    alert(message)
  },
  setViewOnLocate: true,
  zoomMaxOnLocate: 16,
})

tileLayerOsm({
  map,
  zoomMax: 19,
})
