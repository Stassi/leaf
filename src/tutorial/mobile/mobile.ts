import { type ErrorEvent, type LocationEvent } from 'leaflet'

import {
  circle,
  map as leafletMap,
  type Map,
  marker,
  tileLayerOsm,
} from '@stassi/leaf'

const map: Map = await leafletMap({
  fitWorld: true,
  id: 'map',
  locateOptions: {
    maxZoom: 16,
    setView: true,
  },
  async onLocate({
    accuracy: radius,
    latlng: latitudeLongitude,
  }: LocationEvent): Promise<void> {
    await circle({
      latitudeLongitude,
      map,
      radius,
    })
    ;(
      await marker({
        latitudeLongitude,
        map,
        popupContent: `You are within ${radius.toString()} meters from this point.`,
      })
    ).openPopup()
  },
  onLocateError({ message }: ErrorEvent): void {
    // eslint-disable-next-line no-alert -- required by tutorial
    alert(message)
  },
})

await tileLayerOsm({
  map,
  zoomMax: 19,
})
