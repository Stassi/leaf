import { type ErrorEvent, type LocationEvent, type Map } from 'leaflet'

import { circle, map as leafletMap, marker, tileLayerOsm } from '@stassi/leaf'

const map: Map = leafletMap({
  fitWorld: true,
  id: 'map',
  locateOptions: {
    maxZoom: 16,
    setView: true,
  },
  onLocate: ({
    accuracy: radius,
    latlng: latitudeLongitude,
  }: LocationEvent): void => {
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
  onLocateError: ({ message }: ErrorEvent): void => {
    // eslint-disable-next-line no-alert -- required by tutorial
    alert(message)
  },
})

tileLayerOsm({
  map,
  zoomMax: 19,
})
