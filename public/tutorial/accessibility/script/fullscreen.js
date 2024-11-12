import { attributionOsm, urlTemplateOsm } from '../../../script/base-layers.js'
import { marker } from '../../../leaflet-adapter/marker.js'
import { tileLayer } from '../../../leaflet-adapter/tile-layer/tile-layer.js'
import { fullscreenMap } from '../../../script/leaflet-fullscreen.js'

function mapFullscreen({ id, ...props }) {
  return fullscreenMap(id, {
    fullscreenControl: true,
    ...props,
  })
}

const altText = 'Kyiv',
  map = mapFullscreen({
    center: [50.4501, 30.5234],
    id: 'map',
    zoom: 4,
  })

marker({
  altText,
  latitudeLongitude: [50.4501, 30.5234],
  map,
  popupContent: `${altText}, Ukraine is the birthplace of Leaflet!`,
})

tileLayer({
  attribution: attributionOsm,
  map,
  urlTemplate: urlTemplateOsm,
  zoomMax: 19,
})
