import {
  icon,
  marker as leafletMarker,
  type Content,
  type IconOptions,
  type LatLngExpression,
  type Layer,
  type LayerGroup,
  type Map,
  type Marker,
  type MarkerOptions as LeafletMarkerOptions,
  type Popup,
} from 'leaflet'

export type MarkerOptions = LeafletMarkerOptions & {
  latitudeLongitude: LatLngExpression
} & Partial<{
    altText: string
    iconOptions: IconOptions
    map: Map | LayerGroup
    popupContent: ((layer: Layer) => Content) | Content | Popup
  }>

export function marker({
  altText: alt = 'Marker',
  iconOptions,
  latitudeLongitude,
  map,
  popupContent,
  ...props
}: MarkerOptions): Marker {
  const created: Marker = leafletMarker(latitudeLongitude, {
      alt,
      ...(iconOptions ? { icon: icon(iconOptions) } : {}),
      ...props,
    }),
    prerendered: Marker = popupContent
      ? created.bindPopup(popupContent)
      : created

  return map ? prerendered.addTo(map) : prerendered
}
