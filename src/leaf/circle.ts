import {
  type Circle,
  type CircleMarkerOptions,
  type Content,
  type LatLngExpression,
  type Layer,
  type LayerGroup,
  type Map,
  type Popup,
} from 'leaflet'

export type CircleOptions = CircleMarkerOptions & {
  latitudeLongitude: LatLngExpression
} & Partial<{
    color: string
    fillColor: string
    fillOpacity: number
    map: Map | LayerGroup
    popupContent: ((layer: Layer) => Content) | Content | Popup
  }>

const defaultColor = '#3388ff'

export async function circle({
  color = defaultColor,
  fillColor = defaultColor,
  fillOpacity = 0.2,
  latitudeLongitude,
  map,
  popupContent,
  ...props
}: CircleOptions): Promise<Circle> {
  const created: Circle = (await import('leaflet')).circle(latitudeLongitude, {
      color,
      fillColor,
      fillOpacity,
      ...props,
    }),
    conditionallyRendered: Circle = map ? created.addTo(map) : created

  return popupContent
    ? conditionallyRendered.bindPopup(popupContent)
    : conditionallyRendered
}
