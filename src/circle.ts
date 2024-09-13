import {
  circle as leafletCircle,
  type Circle,
  type CircleMarkerOptions,
  type Content,
  type LatLngExpression,
  type Layer,
  type LayerGroup,
  type Map,
  type Popup,
} from 'leaflet'

type CircleOptions = CircleMarkerOptions & {
  latitudeLongitude: LatLngExpression
  map?: Map | LayerGroup
  popupContent?: ((layer: Layer) => Content) | Content | Popup
}

const defaultColor = '#3388ff'

export function circle({
  color = defaultColor,
  fillColor = defaultColor,
  fillOpacity = 0.2,
  latitudeLongitude,
  map,
  popupContent,
  ...props
}: CircleOptions): Circle {
  const created = leafletCircle(latitudeLongitude, {
      color,
      fillColor,
      fillOpacity,
      ...props,
    }),
    conditionallyRendered = map ? created.addTo(map) : created

  return popupContent
    ? conditionallyRendered.bindPopup(popupContent)
    : conditionallyRendered
}
