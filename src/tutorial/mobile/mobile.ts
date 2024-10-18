import 'leaflet/dist/leaflet.css'
import '../style/theme.css'
import '../style/fullscreen.css'

import { type ErrorEvent, type LocationEvent, type Map } from '@stassi/leaf'

const map: Map = await (
  await import('../../leaf/map/map.js')
).map({
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
    await (
      await import('../../leaf/circle.js')
    ).circle({
      latitudeLongitude,
      map,
      radius,
    })
    ;(
      await (
        await import('../../leaf/marker.js')
      ).marker({
        iconOptions: {
          iconUrl: '../../../leaflet/images/marker-icon.png',
          shadowUrl: '../../../leaflet/images/marker-shadow.png',
        },
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

await (
  await import('../../leaf/tile-layer/tile-layer-osm.js')
).tileLayerOsm({
  map,
  zoomMax: 19,
})
