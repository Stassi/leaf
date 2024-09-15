import {
  polygon as leafletPolygon,
  type Content,
  type LatLngExpression,
  type Layer,
  type LayerGroup,
  type Map,
  type Polygon,
  type PolylineOptions,
  type Popup,
} from 'leaflet'

export type PolygonOptions = PolylineOptions & {
  latitudeLongitudes:
    | LatLngExpression[]
    | LatLngExpression[][]
    | LatLngExpression[][][]
} & Partial<{
    map: Map | LayerGroup
    popupContent: ((layer: Layer) => Content) | Content | Popup
  }>

export function polygon({
  latitudeLongitudes,
  map,
  popupContent,
  ...props
}: PolygonOptions): Polygon {
  const created = leafletPolygon(latitudeLongitudes, props),
    prerendered = popupContent ? created.bindPopup(popupContent) : created

  return map ? prerendered.addTo(map) : prerendered
}
