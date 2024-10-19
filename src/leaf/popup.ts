import { type PopupOptions as LeafletPopupOptions } from 'leaflet'

import {
  type Content,
  type LatLngExpression,
  type Layer,
  type Map,
  type Popup,
} from '@stassi/leaf'

export type PopupOptions = Partial<LeafletPopupOptions> & {
  htmlContent: ((source: Layer) => Content) | Content
  latitudeLongitude: LatLngExpression
  map: Map
}

export async function popup({
  htmlContent,
  latitudeLongitude,
  map,
  ...props
}: PopupOptions): Promise<Popup> {
  return (await import('leaflet'))
    .popup(props)
    .setLatLng(latitudeLongitude)
    .setContent(htmlContent)
    .openOn(map)
}
