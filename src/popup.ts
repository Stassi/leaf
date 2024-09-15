import {
  popup as leafletPopup,
  type Content,
  type LatLngExpression,
  type Layer,
  type Map,
  type Popup,
  type PopupOptions as LeafletPopupOptions,
} from 'leaflet'

export type PopupOptions = Partial<LeafletPopupOptions> & {
  htmlContent: ((source: Layer) => Content) | Content
  latitudeLongitude: LatLngExpression
  map: Map
}

export function popup({
  htmlContent,
  latitudeLongitude,
  map,
  ...props
}: PopupOptions): Popup {
  return leafletPopup(props)
    .setLatLng(latitudeLongitude)
    .setContent(htmlContent)
    .openOn(map)
}
