import { type MarkerOptions as LeafletMarkerOptions } from 'leaflet'

import {
  type Content,
  type IconOptions,
  type LatLngExpression,
  type Layer,
  type LayerGroup,
  type Map,
  type Marker,
  type Popup,
} from '@stassi/leaf'

export type MarkerOptions = LeafletMarkerOptions & {
  latitudeLongitude: LatLngExpression
} & Partial<{
    altText: string
    iconOptions: IconOptions
    map: Map | LayerGroup
    popupContent: ((layer: Layer) => Content) | Content | Popup
  }>

export async function marker({
  altText: alt = 'Marker',
  iconOptions,
  latitudeLongitude,
  map,
  popupContent,
  ...props
}: MarkerOptions): Promise<Marker> {
  const created: Marker = (await import('leaflet')).marker(latitudeLongitude, {
      alt,
      ...(iconOptions
        ? { icon: await (await import('./icon.js')).icon(iconOptions) }
        : {}),
      ...props,
    }),
    prerendered: Marker = popupContent
      ? created.bindPopup(popupContent)
      : created

  return map ? prerendered.addTo(map) : prerendered
}
